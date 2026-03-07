/**
 * Server-side session recorder.
 *
 * Records all pipeline events for a session into a JSON log file.
 * After a manual test, read the log to diagnose issues.
 *
 * Logs are written to: app/server/logs/session-<timestamp>.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.resolve(__dirname, "../../logs");

interface SessionEvent {
  t: number;          // ms since session start
  source: string;     // client | stt | llm | tts | pipeline
  event: string;
  detail?: Record<string, unknown>;
}

export class SessionRecorder {
  private events: SessionEvent[] = [];
  private startTime = Date.now();
  private sessionId: string;
  private audioChunksIn = 0;
  private audioChunksOut = 0;
  private logPath: string;

  constructor() {
    this.sessionId = `session-${new Date().toISOString().replace(/[:.]/g, "-")}`;

    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true });
    }
    this.logPath = path.join(LOGS_DIR, `${this.sessionId}.json`);
    console.log(`[Recorder] Session log: ${this.logPath}`);
  }

  log(source: string, event: string, detail?: Record<string, unknown>): void {
    const t = Date.now() - this.startTime;
    this.events.push({ t, source, event, ...(detail ? { detail } : {}) });
  }

  audioIn(): void {
    this.audioChunksIn++;
  }

  audioOut(): void {
    this.audioChunksOut++;
  }

  flush(): void {
    const data = {
      sessionId: this.sessionId,
      startedAt: new Date(this.startTime).toISOString(),
      duration: Date.now() - this.startTime,
      audioChunksIn: this.audioChunksIn,
      audioChunksOut: this.audioChunksOut,
      events: this.events,
    };

    try {
      fs.writeFileSync(this.logPath, JSON.stringify(data, null, 2));
      console.log(
        `[Recorder] Flushed ${this.events.length} events to ${this.logPath}`
      );
    } catch (err) {
      console.error("[Recorder] Failed to write log:", err);
    }
  }
}
