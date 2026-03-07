/**
 * End-to-end audio pipeline test.
 *
 * Sends real WAV audio through the WebSocket → Deepgram STT → LLM → TTS
 * and verifies the full chain works without a browser.
 *
 * Usage: npx tsx app/server/test/test-audio-pipeline.ts
 */

import WebSocket from "ws";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WS_URL = "ws://localhost:3002/ws/session";
const FIXTURES_DIR = path.join(__dirname, "fixtures");

// WAV audio is sent in chunks to simulate real-time streaming.
// 16kHz 16-bit mono = 32,000 bytes/sec. 100ms chunk = 3,200 bytes.
const CHUNK_SIZE = 3200;
const CHUNK_INTERVAL_MS = 100;
const WAV_HEADER_SIZE = 44;

interface AudioTestCase {
  name: string;
  audioFile: string;
  expectedWords: string[]; // At least some of these words should appear in transcript
}

interface AudioTestResult {
  name: string;
  transcript: string;
  npcText: string;
  audioChunks: number;
  audioChunksSent: number;
  hasNarration: boolean;
  transcriptMatchedWords: string[];
  transcriptMissedWords: string[];
  timeToTranscript: number;
  timeToFirstNPCText: number;
  timeToFirstAudio: number;
  totalTime: number;
  passed: boolean;
  errors: string[];
  events: string[]; // Timeline of events for debugging
}

const TEST_CASES: AudioTestCase[] = [
  {
    name: "Hello tavern",
    audioFile: "hello_tavern.wav",
    expectedWords: ["hello", "place"],
  },
  {
    name: "Missing ship",
    audioFile: "missing_ship.wav",
    expectedWords: ["missing", "ship"],
  },
  {
    name: "Buy a drink",
    audioFile: "buy_drink.wav",
    expectedWords: ["buy", "drink"],
  },
];

function checkNarration(text: string): boolean {
  return /\*[^*]+\*/.test(text) || /\([^)]*(?:looks|leans|smiles|nods|pauses|sighs)[^)]*\)/i.test(text);
}

async function runAudioTest(tc: AudioTestCase): Promise<AudioTestResult> {
  const result: AudioTestResult = {
    name: tc.name,
    transcript: "",
    npcText: "",
    audioChunks: 0,
    audioChunksSent: 0,
    hasNarration: false,
    transcriptMatchedWords: [],
    transcriptMissedWords: [],
    timeToTranscript: 0,
    timeToFirstNPCText: 0,
    timeToFirstAudio: 0,
    totalTime: 0,
    passed: false,
    errors: [],
    events: [],
  };

  const audioPath = path.join(FIXTURES_DIR, tc.audioFile);
  if (!fs.existsSync(audioPath)) {
    result.errors.push(`Audio file not found: ${audioPath}`);
    return result;
  }

  const audioData = fs.readFileSync(audioPath);
  // Skip WAV header — Deepgram is configured for raw linear16, not WAV container
  const pcmStart = WAV_HEADER_SIZE;

  return new Promise((resolve) => {
    const ws = new WebSocket(WS_URL);
    const start = Date.now();
    let connected = false;
    let firstTranscript = false;
    let firstNPCText = false;
    let firstAudio = false;
    let streamingAudio = false;
    let streamTimeout: ReturnType<typeof setTimeout> | null = null;

    const log = (msg: string) => {
      result.events.push(`+${Date.now() - start}ms ${msg}`);
    };

    const timeout = setTimeout(() => {
      log("TIMEOUT (45s)");
      result.errors.push("Timed out after 45s");
      ws.close();
      resolve(result);
    }, 45000);

    ws.onopen = () => {
      log("Connected");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data.toString());

      switch (msg.type) {
        case "connected":
          connected = true;
          log(`Session ready, NPC: ${msg.npc.name}`);
          // Start the PTT flow
          startAudioStream();
          break;

        case "transcript":
          if (!firstTranscript && msg.isFinal) {
            result.timeToTranscript = Date.now() - start;
            firstTranscript = true;
          }
          result.transcript = msg.text;
          log(`Transcript (final=${msg.isFinal}): "${msg.text}"`);
          break;

        case "npc_text":
          if (!firstNPCText) {
            result.timeToFirstNPCText = Date.now() - start;
            firstNPCText = true;
          }
          result.npcText += msg.text;
          break;

        case "npc_audio":
          if (!firstAudio) {
            result.timeToFirstAudio = Date.now() - start;
            firstAudio = true;
          }
          result.audioChunks++;
          break;

        case "npc_done":
          log(`NPC done — "${result.npcText.substring(0, 80)}..."`);
          result.totalTime = Date.now() - start;
          finishTest();
          break;

        case "status":
          log(`Pipeline: ${msg.status}`);
          break;

        case "error":
          log(`Error: ${msg.message}`);
          result.errors.push(`Server error: ${msg.message}`);
          break;
      }
    };

    ws.onerror = (err) => {
      result.errors.push(`WebSocket error: ${err.message}`);
      clearTimeout(timeout);
      resolve(result);
    };

    ws.onclose = () => {
      if (!connected) {
        result.errors.push("Connection closed before test could run");
        clearTimeout(timeout);
        resolve(result);
      }
    };

    function startAudioStream() {
      log("Sending start_recording");
      ws.send(JSON.stringify({ type: "start_recording" }));

      // Stream WAV audio in real-time chunks
      streamingAudio = true;
      let offset = pcmStart;

      const sendChunk = () => {
        if (offset >= audioData.length) {
          // All audio sent — wait a beat for the last chunk to arrive, then stop
          log(`All audio sent (${result.audioChunksSent} chunks)`);
          setTimeout(() => {
            log("Sending stop_recording");
            ws.send(JSON.stringify({ type: "stop_recording" }));
            streamingAudio = false;
          }, 200);
          return;
        }

        const chunk = audioData.slice(offset, offset + CHUNK_SIZE);
        const base64 = chunk.toString("base64");
        ws.send(JSON.stringify({ type: "audio", data: base64 }));
        result.audioChunksSent++;
        offset += CHUNK_SIZE;

        streamTimeout = setTimeout(sendChunk, CHUNK_INTERVAL_MS);
      };

      // Small delay after start_recording to let Deepgram connection open
      setTimeout(sendChunk, 300);
    }

    function finishTest() {
      if (streamTimeout) clearTimeout(streamTimeout);
      clearTimeout(timeout);

      result.hasNarration = checkNarration(result.npcText);

      // Check transcript accuracy
      const transcriptLower = result.transcript.toLowerCase();
      for (const word of tc.expectedWords) {
        if (transcriptLower.includes(word.toLowerCase())) {
          result.transcriptMatchedWords.push(word);
        } else {
          result.transcriptMissedWords.push(word);
        }
      }

      // Determine pass/fail
      if (!result.transcript) result.errors.push("No transcript received");
      if (!result.npcText) result.errors.push("No NPC text received");
      if (result.audioChunks === 0) result.errors.push("No audio chunks received");
      if (result.hasNarration) result.errors.push("Narration detected in response");
      if (result.transcriptMissedWords.length > 0) {
        result.errors.push(
          `Transcript missing expected words: ${result.transcriptMissedWords.join(", ")}`
        );
      }

      result.passed = result.errors.length === 0;

      ws.close();
      resolve(result);
    }
  });
}

async function main() {
  console.log("=== Audio Pipeline End-to-End Test ===\n");
  console.log(`Server: ${WS_URL}`);
  console.log(`Fixtures: ${FIXTURES_DIR}`);
  console.log(`Tests: ${TEST_CASES.length}\n`);

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < TEST_CASES.length; i++) {
    const tc = TEST_CASES[i];
    console.log(`--- Test ${i + 1}: ${tc.name} (${tc.audioFile}) ---`);

    const result = await runAudioTest(tc);

    if (result.passed) {
      passed++;
      console.log(`  PASS`);
    } else {
      failed++;
      console.log(`  FAIL`);
      for (const err of result.errors) {
        console.log(`    - ${err}`);
      }
    }

    console.log(`  Transcript: "${result.transcript}"`);
    console.log(`  NPC: "${result.npcText.substring(0, 120)}${result.npcText.length > 120 ? "..." : ""}"`);
    console.log(`  Audio out: ${result.audioChunks} chunks | Audio in: ${result.audioChunksSent} chunks`);
    console.log(`  Timing: transcript=${result.timeToTranscript}ms, first_npc_text=${result.timeToFirstNPCText}ms, first_audio=${result.timeToFirstAudio}ms, total=${result.totalTime}ms`);

    if (!result.passed) {
      console.log(`  Event timeline:`);
      for (const ev of result.events) {
        console.log(`    ${ev}`);
      }
    }

    console.log();

    // Gap between tests to avoid rate limiting
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
