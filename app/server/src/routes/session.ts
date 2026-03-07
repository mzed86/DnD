import type { FastifyInstance } from "fastify";
import { VoicePipeline } from "../services/pipeline.js";
import { MIRA_ASHVANE } from "../npcs/mira-ashvane.js";
import { SessionRecorder } from "../services/session-recorder.js";

export async function sessionRoute(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/ws/session",
    { websocket: true },
    (socket, _req) => {
      console.log("[Session] Client connected");

      const recorder = new SessionRecorder();
      recorder.log("client", "connected");

      const pipeline = new VoicePipeline({
        name: MIRA_ASHVANE.name,
        systemPrompt: MIRA_ASHVANE.systemPrompt,
        voiceId: MIRA_ASHVANE.voiceId,
      });

      // Forward pipeline events to client
      pipeline.on("transcript", (text: string, isFinal: boolean) => {
        if (isFinal) recorder.log("stt", "transcript_final", { text });
        send({ type: "transcript", text, isFinal });
      });

      pipeline.on("npc_text", (text: string) => {
        send({ type: "npc_text", text });
      });

      pipeline.on("npc_done", () => {
        recorder.log("pipeline", "npc_done");
        send({ type: "npc_done" });
      });

      pipeline.on("status_change", (status: string) => {
        recorder.log("pipeline", "status_change", { status });
        send({ type: "status", status });
      });

      pipeline.on("barge_in", () => {
        recorder.log("pipeline", "barge_in");
        send({ type: "barge_in" });
      });

      pipeline.on("error", (message: string) => {
        recorder.log("pipeline", "error", { message });
        send({ type: "error", message });
      });

      pipeline.on("npc_audio", (data: string) => {
        recorder.audioOut();
        send({ type: "npc_audio", data });
      });

      // Handle client messages
      socket.on("message", (raw: Buffer | string) => {
        try {
          const msg = JSON.parse(
            typeof raw === "string" ? raw : raw.toString()
          );

          switch (msg.type) {
            case "audio": {
              recorder.audioIn();
              const audioBuffer = Buffer.from(msg.data, "base64");
              pipeline.handleAudio(audioBuffer);
              break;
            }
            case "start_recording":
              console.log("[Session] << start_recording");
              recorder.log("client", "start_recording");
              pipeline.startListening();
              break;
            case "stop_recording":
              console.log("[Session] << stop_recording");
              recorder.log("client", "stop_recording");
              pipeline.stopRecording();
              break;
            case "text_input":
              console.log(`[Session] << text_input: "${msg.text}"`);
              recorder.log("client", "text_input", { text: msg.text });
              if (msg.text) {
                pipeline.injectText(msg.text);
              }
              break;
            default:
              console.warn("[Session] Unknown message type:", msg.type);
          }
        } catch (err) {
          console.error("[Session] Failed to parse message:", err);
        }
      });

      socket.on("close", () => {
        console.log("[Session] Client disconnected");
        recorder.log("client", "disconnected");
        recorder.flush();
        pipeline.cleanup();
      });

      function send(data: Record<string, unknown>): void {
        if (socket.readyState === 1) {
          socket.send(JSON.stringify(data));
        }
      }

      // Send initial connection confirmation
      send({
        type: "connected",
        npc: { name: MIRA_ASHVANE.name, description: MIRA_ASHVANE.description },
      });
    }
  );
}
