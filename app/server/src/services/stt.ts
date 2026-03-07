import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { EventEmitter } from "events";
import { config } from "../config.js";

export class DeepgramSTT extends EventEmitter {
  private connection: ReturnType<
    ReturnType<typeof createClient>["listen"]["live"]
  > | null = null;
  private deepgram = createClient(config.deepgram.apiKey);
  private finalTranscript = "";
  private keepAliveInterval: ReturnType<typeof setInterval> | null = null;
  private isOpen = false;
  private openPromise: Promise<void> | null = null;
  private pendingAudio: Buffer[] = [];
  private finalizePending = false;

  /**
   * Opens a fresh Deepgram streaming connection.
   * Closes any existing connection first. Audio sent via send() is
   * buffered until the connection opens.
   */
  start(): Promise<void> {
    this.close();

    this.finalTranscript = "";
    this.pendingAudio = [];
    this.finalizePending = false;

    this.openPromise = new Promise<void>((resolve, reject) => {
      console.log("[STT] Opening Deepgram connection...");

      const connection = this.deepgram.listen.live({
        model: "nova-3",
        language: "en",
        encoding: "linear16",
        sample_rate: 16000,
        channels: 1,
        smart_format: true,
        interim_results: true,
        utterance_end_ms: 1200,
        vad_events: true,
        endpointing: 300,
      });

      this.connection = connection;

      connection.on(LiveTranscriptionEvents.Open, () => {
        if (this.connection !== connection) return;

        console.log("[STT] Connection opened");
        this.isOpen = true;

        if (this.pendingAudio.length > 0) {
          console.log(
            `[STT] Flushing ${this.pendingAudio.length} buffered chunks`
          );
          for (const chunk of this.pendingAudio) {
            this.sendRaw(chunk);
          }
          this.pendingAudio = [];
        }

        resolve();
      });

      connection.on(
        LiveTranscriptionEvents.Transcript,
        (data: any) => {
          if (this.connection !== connection) return;

          const transcript =
            data.channel?.alternatives?.[0]?.transcript;
          if (!transcript) return;

          if (data.is_final) {
            this.finalTranscript +=
              (this.finalTranscript ? " " : "") + transcript;
            this.emit("transcript", this.finalTranscript, true);
            console.log(
              `[STT] Final segment: "${transcript}" (accumulated: "${this.finalTranscript}")`
            );

            // If finalize() was called, emit speech_final IMMEDIATELY
            // instead of waiting for UtteranceEnd (which adds ~1200ms)
            if (this.finalizePending && this.finalTranscript.trim()) {
              console.log("[STT] Finalize produced transcript — emitting immediately");
              this.finalizePending = false;
              this.emit("speech_final", this.finalTranscript.trim());
              this.finalTranscript = "";
            }
          } else {
            const interim = this.finalTranscript
              ? this.finalTranscript + " " + transcript
              : transcript;
            this.emit("transcript", interim, false);
          }
        }
      );

      connection.on(LiveTranscriptionEvents.SpeechStarted, () => {
        if (this.connection !== connection) return;
        console.log("[STT] Speech detected");
        this.emit("speech_started");
      });

      connection.on(LiveTranscriptionEvents.UtteranceEnd, () => {
        if (this.connection !== connection) return;
        console.log("[STT] Utterance end");
        if (this.finalTranscript.trim()) {
          this.emit("speech_final", this.finalTranscript.trim());
          this.finalTranscript = "";
        }
      });

      connection.on(
        LiveTranscriptionEvents.Error,
        (error: any) => {
          if (this.connection !== connection) return;
          console.error("[STT] Error:", error);
          this.emit(
            "error",
            error instanceof Error ? error : new Error(String(error))
          );
        }
      );

      connection.on(LiveTranscriptionEvents.Close, () => {
        if (this.connection !== connection) return;
        console.log("[STT] Connection closed (by Deepgram)");
        this.isOpen = false;
        this.openPromise = null;
        if (this.keepAliveInterval) {
          clearInterval(this.keepAliveInterval);
          this.keepAliveInterval = null;
        }
        this.emit("close");
      });

      this.keepAliveInterval = setInterval(() => {
        if (this.connection === connection && this.isOpen) {
          connection.keepAlive();
        }
      }, 3000);

      setTimeout(() => {
        if (this.connection === connection && !this.isOpen) {
          reject(new Error("STT connection timed out"));
        }
      }, 10000);
    });

    return this.openPromise;
  }

  private sendRaw(audioBuffer: Buffer): void {
    if (this.connection && this.isOpen) {
      const ab = audioBuffer.buffer.slice(
        audioBuffer.byteOffset,
        audioBuffer.byteOffset + audioBuffer.byteLength
      );
      this.connection.send(ab as ArrayBuffer);
    }
  }

  send(audioBuffer: Buffer): void {
    if (!this.isOpen) {
      this.pendingAudio.push(audioBuffer);
      return;
    }
    this.sendRaw(audioBuffer);
  }

  /**
   * Flush any accumulated transcript, or tell Deepgram to finalize.
   * When finalize() is called, the next is_final transcript will
   * trigger speech_final immediately (no UtteranceEnd wait).
   */
  finishSpeech(): boolean {
    if (this.finalTranscript.trim()) {
      console.log(
        `[STT] Flushing accumulated transcript: "${this.finalTranscript.trim()}"`
      );
      this.finalizePending = false;
      this.emit("speech_final", this.finalTranscript.trim());
      this.finalTranscript = "";
      return true;
    }

    if (this.connection && this.isOpen) {
      console.log("[STT] No transcript yet, calling Deepgram finalize()");
      this.finalizePending = true;
      this.connection.finalize();
    } else {
      console.log("[STT] finishSpeech: connection not open, nothing to flush");
    }
    return false;
  }

  close(): void {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    const conn = this.connection;
    this.connection = null;
    this.isOpen = false;
    this.openPromise = null;
    this.pendingAudio = [];
    this.finalTranscript = "";
    this.finalizePending = false;
    if (conn) {
      try {
        conn.disconnect();
      } catch {
        // Ignore errors on close
      }
    }
  }
}
