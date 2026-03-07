/**
 * Automated pipeline test — connects via WebSocket and tests:
 * 1. Text input → LLM → TTS (bypasses STT)
 * 2. Verifies no action narration in responses
 * 3. Verifies audio chunks are received
 * 4. Reports timing
 *
 * Usage: npx tsx app/server/src/test-pipeline.ts
 */

import WebSocket from "ws";

const WS_URL = "ws://localhost:3002/ws/session";
const TEST_INPUTS = [
  "Hello there, what is this place?",
  "Do you know anything about a missing ship?",
  "I heard you used to be a smuggler. Is that true?",
];

interface TestResult {
  input: string;
  npcText: string;
  audioChunks: number;
  hasNarration: boolean;
  timeToFirstText: number;
  timeToFirstAudio: number;
  totalTime: number;
  passed: boolean;
  errors: string[];
}

function checkNarration(text: string): boolean {
  return /\*[^*]+\*/.test(text) || /\([^)]*(?:looks|leans|smiles|nods|pauses|sighs|gestures|sets|picks|raises|turns|glances)[^)]*\)/i.test(text);
}

async function runTest(input: string): Promise<TestResult> {
  return new Promise((resolve) => {
    const result: TestResult = {
      input,
      npcText: "",
      audioChunks: 0,
      hasNarration: false,
      timeToFirstText: 0,
      timeToFirstAudio: 0,
      totalTime: 0,
      passed: false,
      errors: [],
    };

    const ws = new WebSocket(WS_URL);
    const start = Date.now();
    let firstText = false;
    let firstAudio = false;
    let connected = false;

    const timeout = setTimeout(() => {
      result.errors.push("Timed out after 30s");
      ws.close();
      resolve(result);
    }, 30000);

    ws.onopen = () => {
      console.log(`  [ws] Connected`);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data.toString());

      switch (msg.type) {
        case "connected":
          connected = true;
          console.log(`  [ws] Session ready, NPC: ${msg.npc.name}`);
          // Wait a beat, then send text input
          setTimeout(() => {
            console.log(`  [ws] Sending: "${input}"`);
            ws.send(JSON.stringify({ type: "text_input", text: input }));
          }, 500);
          break;

        case "npc_text":
          if (!firstText) {
            result.timeToFirstText = Date.now() - start;
            firstText = true;
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
          result.totalTime = Date.now() - start;
          result.hasNarration = checkNarration(result.npcText);

          if (!result.npcText) result.errors.push("No NPC text received");
          if (result.audioChunks === 0) result.errors.push("No audio chunks received");
          if (result.hasNarration) result.errors.push(`Narration detected: "${result.npcText}"`);

          result.passed = result.errors.length === 0;

          clearTimeout(timeout);
          ws.close();
          resolve(result);
          break;

        case "error":
          result.errors.push(`Server error: ${msg.message}`);
          break;

        case "status":
          console.log(`  [ws] Pipeline status: ${msg.status}`);
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
  });
}

async function main() {
  console.log("=== NPC Voice Pipeline Test ===\n");
  console.log(`Server: ${WS_URL}`);
  console.log(`Tests: ${TEST_INPUTS.length}\n`);

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < TEST_INPUTS.length; i++) {
    const input = TEST_INPUTS[i];
    console.log(`--- Test ${i + 1}: "${input}" ---`);

    const result = await runTest(input);

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

    console.log(`  NPC: "${result.npcText.substring(0, 100)}${result.npcText.length > 100 ? "..." : ""}"`);
    console.log(`  Audio chunks: ${result.audioChunks}`);
    console.log(`  Time to first text: ${result.timeToFirstText}ms`);
    console.log(`  Time to first audio: ${result.timeToFirstAudio}ms`);
    console.log(`  Total: ${result.totalTime}ms`);
    console.log();

    // Small gap between tests
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
