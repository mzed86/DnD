/**
 * Client-side event logger for test sessions.
 *
 * Captures timestamped events from all parts of the UI:
 * PTT/VAD interactions, WebSocket messages, audio flow, pipeline states, errors.
 *
 * Access in browser console:
 *   window.__eventLog.events   — raw event array
 *   window.__eventLog.dump()   — pretty-print summary
 *   window.__eventLog.export() — copy-pasteable JSON
 *   window.__eventLog.clear()  — reset
 */

export interface LogEvent {
  t: number;       // ms since session start
  cat: string;     // category: capture | ws | pipeline | playback | ui | error
  event: string;   // event name
  detail?: Record<string, unknown>;
}

class EventLogger {
  events: LogEvent[] = [];
  private startTime = Date.now();
  private audioChunksSent = 0;
  private audioChunksReceived = 0;
  private lastAudioSentAt = 0;
  private lastAudioReceivedAt = 0;

  log(cat: string, event: string, detail?: Record<string, unknown>): void {
    const t = Date.now() - this.startTime;
    const entry: LogEvent = { t, cat, event, ...(detail ? { detail } : {}) };
    this.events.push(entry);

    // Also log to console with color coding
    const colors: Record<string, string> = {
      capture: "color: #4fc3f7",
      ws: "color: #81c784",
      pipeline: "color: #ffb74d",
      playback: "color: #ce93d8",
      ui: "color: #90a4ae",
      error: "color: #ef5350; font-weight: bold",
    };
    const style = colors[cat] || "color: gray";
    console.log(
      `%c[${cat}] +${t}ms %c${event}`,
      style,
      "color: inherit",
      detail || ""
    );
  }

  // Audio chunk counters (avoid flooding the log with individual chunks)
  audioSent(): void {
    this.audioChunksSent++;
    this.lastAudioSentAt = Date.now() - this.startTime;
  }

  audioReceived(): void {
    this.audioChunksReceived++;
    this.lastAudioReceivedAt = Date.now() - this.startTime;
  }

  dump(): void {
    console.group("=== Event Log Dump ===");
    console.log(`Session duration: ${Date.now() - this.startTime}ms`);
    console.log(`Total events: ${this.events.length}`);
    console.log(`Audio chunks sent: ${this.audioChunksSent}`);
    console.log(`Audio chunks received: ${this.audioChunksReceived}`);
    console.log("");

    // Group by interaction (each PTT press or VAD speech segment)
    let interactionNum = 0;
    for (const ev of this.events) {
      if (ev.event === "ptt_press" || ev.event === "vad_speech_start") {
        interactionNum++;
        console.log(`--- Interaction ${interactionNum} ---`);
      }
      const detailStr = ev.detail ? ` ${JSON.stringify(ev.detail)}` : "";
      console.log(`  +${ev.t}ms [${ev.cat}] ${ev.event}${detailStr}`);
    }

    console.log("");
    console.log(
      `Audio: ${this.audioChunksSent} chunks sent, ${this.audioChunksReceived} chunks received`
    );
    console.groupEnd();
  }

  export(): string {
    const data = {
      sessionDuration: Date.now() - this.startTime,
      audioChunksSent: this.audioChunksSent,
      audioChunksReceived: this.audioChunksReceived,
      events: this.events,
    };
    const json = JSON.stringify(data, null, 2);
    console.log(json);
    return json;
  }

  clear(): void {
    this.events = [];
    this.audioChunksSent = 0;
    this.audioChunksReceived = 0;
    this.startTime = Date.now();
    console.log("[EventLogger] Cleared");
  }
}

export const eventLogger = new EventLogger();

// Expose on window for console access
if (typeof window !== "undefined") {
  (window as any).__eventLog = eventLogger;
}
