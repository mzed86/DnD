import WebSocket from "ws";
import { EventEmitter } from "events";
import { config } from "../config.js";

export class CartesiaTTS extends EventEmitter {
  private cancelledFlag = false;
  private activeWs: WebSocket | null = null;

  /** Cancel any in-progress speak() call. */
  cancel(): void {
    this.cancelledFlag = true;
    if (this.activeWs && this.activeWs.readyState === WebSocket.OPEN) {
      this.activeWs.close();
      this.activeWs = null;
    }
  }

  /**
   * Streams LLM token chunks through Cartesia WebSocket TTS.
   * Buffers tokens into sentences, sends each sentence as a continuation
   * so audio starts playing before the full LLM response is done.
   */
  async speak(
    textChunks: AsyncIterable<string>,
    voiceId: string
  ): Promise<void> {
    this.cancelledFlag = false;
    const startTime = Date.now();

    const wsUrl = `wss://api.cartesia.ai/tts/websocket?api_key=${config.cartesia.apiKey}&cartesia_version=2025-04-16`;
    const ws = new WebSocket(wsUrl);
    this.activeWs = ws;

    await new Promise<void>((resolve, reject) => {
      ws.onopen = () => resolve();
      ws.onerror = (err) => reject(err);
    });

    if (this.cancelledFlag) {
      ws.close();
      this.activeWs = null;
      return;
    }

    const contextId = `ctx-${Date.now()}`;
    let firstAudioEmitted = false;
    let resolveAudioDone: (() => void) | null = null;
    const audioDone = new Promise<void>((r) => {
      resolveAudioDone = r;
    });

    // Single message handler for all audio from this context
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(
          typeof event.data === "string" ? event.data : event.data.toString()
        );
        if (msg.context_id !== contextId) return;

        if (msg.type === "chunk" && msg.data) {
          if (!firstAudioEmitted) {
            console.log(`[TTS] First audio: ${Date.now() - startTime}ms`);
            firstAudioEmitted = true;
          }
          this.emit("audio", msg.data);
        }

        if (msg.done === true) {
          resolveAudioDone?.();
        }
      } catch {
        /* ignore parse errors */
      }
    };

    ws.onerror = (err) => {
      console.error("[TTS] WebSocket error:", err);
      this.emit("error", "TTS WebSocket error");
    };

    const sendChunk = (text: string, continueStream: boolean) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(
        JSON.stringify({
          model_id: "sonic-2",
          transcript: text,
          voice: { mode: "id", id: voiceId },
          output_format: {
            container: "raw",
            encoding: "pcm_s16le",
            sample_rate: 24000,
          },
          language: "en",
          context_id: contextId,
          continue: continueStream,
        })
      );
    };

    // Buffer LLM tokens into sentences for efficient TTS streaming
    let buffer = "";
    let sentCount = 0;
    const SENTENCE_RE = /(?<=[.!?])\s+/;

    for await (const token of textChunks) {
      if (this.cancelledFlag) break;
      buffer += token;
      const parts = buffer.split(SENTENCE_RE);

      if (parts.length > 1) {
        for (let i = 0; i < parts.length - 1; i++) {
          const sentence = parts[i].trim();
          if (sentence) {
            sentCount++;
            console.log(
              `[TTS] Sentence ${sentCount} (${sentence.length} chars): "${sentence.substring(0, 60)}..."`
            );
            sendChunk(sentence, true);
          }
        }
        buffer = parts[parts.length - 1];
      }
    }

    // If cancelled mid-stream, bail out
    if (this.cancelledFlag) {
      console.log("[TTS] Cancelled mid-stream");
      if (ws.readyState === WebSocket.OPEN) ws.close();
      this.activeWs = null;
      return;
    }

    // Send final chunk with continue: false
    if (buffer.trim()) {
      sentCount++;
      console.log(
        `[TTS] Final sentence ${sentCount} (${buffer.trim().length} chars): "${buffer.trim().substring(0, 60)}..."`
      );
      sendChunk(buffer.trim(), false);
    } else if (sentCount > 0) {
      // All text ended on a sentence boundary; signal end
      sendChunk("", false);
    } else {
      // No text generated at all
      ws.close();
      this.emit("done");
      return;
    }

    // Wait for Cartesia to finish streaming audio
    await Promise.race([
      audioDone,
      new Promise<void>((r) => setTimeout(r, 30000)),
    ]);

    console.log(
      `[TTS] Complete: ${Date.now() - startTime}ms (${sentCount} sentences)`
    );
    ws.close();
    this.activeWs = null;
    this.emit("done");
  }

  disconnect(): void {
    // Cleanup is per speak() call
  }
}
