import { EventEmitter } from "events";
import { DeepgramSTT } from "./stt.js";
import { streamNPCResponse, type ConversationMessage } from "./llm.js";
import { CartesiaTTS } from "./tts.js";

export type PipelineState = "idle" | "listening" | "processing" | "speaking";

interface NPCConfig {
  name: string;
  systemPrompt: string;
  voiceId: string;
}

/**
 * Strip narration/stage directions from LLM output.
 * Removes *action text* and (action text) so TTS only speaks dialogue.
 */
function stripNarration(stream: AsyncIterable<string>): AsyncGenerator<string> {
  let inAsterisk = false;
  let inParen = false;

  async function* filter() {
    for await (const chunk of stream) {
      let result = "";
      for (const char of chunk) {
        if (char === "*") {
          inAsterisk = !inAsterisk;
          continue;
        }
        if (char === "(" && !inAsterisk) {
          inParen = true;
          continue;
        }
        if (char === ")" && inParen) {
          inParen = false;
          continue;
        }
        if (!inAsterisk && !inParen) {
          result += char;
        }
      }
      if (result) {
        yield result;
      }
    }
  }

  return filter();
}

export class VoicePipeline extends EventEmitter {
  private stt: DeepgramSTT;
  private tts: CartesiaTTS;
  private history: ConversationMessage[] = [];
  private state: PipelineState = "idle";
  private npc: NPCConfig;
  private stopTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(npc: NPCConfig) {
    super();
    this.npc = npc;
    this.stt = new DeepgramSTT();
    this.tts = new CartesiaTTS();
    this.setupSTTHandlers();

    this.tts.on("audio", (data: string) => {
      this.emit("npc_audio", data);
    });
  }

  private setupSTTHandlers(): void {
    this.stt.on("transcript", (text: string, isFinal: boolean) => {
      this.emit("transcript", text, isFinal);
    });

    this.stt.on("speech_started", () => {
      if (this.state === "speaking") {
        console.log("[Pipeline] Barge-in detected");
        this.emit("barge_in");
      }
    });

    this.stt.on("speech_final", (text: string) => {
      console.log(`[Pipeline] Speech final: "${text}"`);
      // Close STT immediately — we have our transcript. Keeping it open
      // causes phantom barge-ins (residual audio triggers speech_started)
      // and runaway transcription (captures speech not meant for the NPC).
      this.stt.close();
      this.processPlayerInput(text);
    });

    this.stt.on("error", (error: Error) => {
      this.emit("error", error.message);
    });
  }

  private setState(state: PipelineState): void {
    if (this.state !== state) {
      console.log(`[Pipeline] State: ${this.state} -> ${state}`);
    }
    this.state = state;
    this.emit("status_change", state);
  }

  private async processPlayerInput(playerText: string): Promise<void> {
    if (!playerText.trim()) return;

    // Clear any pending stop timeout
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    this.setState("processing");
    const pipelineStart = Date.now();

    this.history.push({ role: "user", content: playerText });

    try {
      let fullResponse = "";
      const llmStream = streamNPCResponse(
        this.npc.systemPrompt,
        this.history,
        playerText
      );

      const cleanStream = stripNarration(llmStream);

      const self = this;
      async function* teeStream() {
        let started = false;
        for await (const chunk of cleanStream) {
          let text = chunk;
          // Strip leading whitespace from the very first chunk
          if (!started) {
            text = text.trimStart();
            if (!text) continue;
            started = true;
          }
          fullResponse += text;
          self.emit("npc_text", text);
          yield text;
        }
      }

      this.setState("speaking");
      await this.tts.speak(teeStream(), this.npc.voiceId);

      this.history.push({ role: "assistant", content: fullResponse });

      console.log(
        `[Pipeline] Total pipeline: ${Date.now() - pipelineStart}ms`
      );
      this.emit("npc_done");
      this.setState("idle");
    } catch (error) {
      console.error("[Pipeline] Error:", error);
      this.emit(
        "error",
        error instanceof Error ? error.message : "Pipeline error"
      );
      this.setState("idle");
    }
  }

  handleAudio(chunk: Buffer): void {
    this.stt.send(chunk);
  }

  /**
   * Open a FRESH Deepgram connection for this recording session.
   * Each PTT press (or VAD speech segment) gets its own connection
   * to avoid issues with multiple webm init segments on the same stream.
   */
  startListening(): void {
    // Cancel any pending stop timeout from a previous recording
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    // Barge-in: if NPC is speaking, cancel TTS and notify client
    if (this.state === "speaking" || this.state === "processing") {
      console.log("[Pipeline] Barge-in — cancelling current response");
      this.tts.cancel();
      this.emit("barge_in");
    }

    // start() internally closes any existing connection first
    this.stt.start().then(() => {
      console.log("[Pipeline] STT ready");
    }).catch((err) => {
      console.error("[Pipeline] STT connect failed:", err);
      this.emit("error", "Failed to connect to speech recognition");
      if (this.state === "listening") {
        this.setState("idle");
      }
    });
    this.setState("listening");
  }

  stopRecording(): void {
    const hadTranscript = this.stt.finishSpeech();

    if (!hadTranscript) {
      // finalize() was called — wait for the result via speech_final event.
      // Timeout as fallback: try to flush one more time before giving up.
      this.stopTimeout = setTimeout(() => {
        // Check if a transcript accumulated while we were waiting
        const lateFlush = this.stt.finishSpeech();
        if (!lateFlush && this.state === "listening") {
          console.log("[Pipeline] Stop timeout — no transcript received, resetting to idle");
          this.setState("idle");
        }
        this.stopTimeout = null;
      }, 3000);
    }
  }

  /** Bypass STT — inject text directly into the LLM->TTS pipeline */
  injectText(text: string): void {
    console.log(`[Pipeline] Text injected: "${text}"`);
    this.emit("transcript", text, true);
    this.processPlayerInput(text);
  }

  async cleanup(): Promise<void> {
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }
    this.stt.close();
    this.tts.disconnect();
    this.removeAllListeners();
  }
}
