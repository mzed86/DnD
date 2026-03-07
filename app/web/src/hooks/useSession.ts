"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { eventLogger } from "@/lib/event-logger";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";
export type PipelineStatus =
  | "idle"
  | "listening"
  | "processing"
  | "speaking";

export interface ChatMessage {
  id: string;
  role: "player" | "npc";
  text: string;
  timestamp: number;
}

interface NPCInfo {
  name: string;
  description: string;
}

const WS_URL =
  typeof window !== "undefined"
    ? `ws://${window.location.hostname}:3002/ws/session`
    : "";

export function useSession() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [pipelineStatus, setPipelineStatus] =
    useState<PipelineStatus>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [currentNPCText, setCurrentNPCText] = useState("");
  const [npcInfo, setNPCInfo] = useState<NPCInfo | null>(null);
  const currentTranscriptRef = useRef("");
  const currentNPCTextRef = useRef("");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onAudioChunkRef = useRef<((base64: string) => void) | null>(null);
  const onBargeInRef = useRef<(() => void) | null>(null);
  const audioSuppressedRef = useRef(false);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus("connecting");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[Session] Connected");
      eventLogger.log("ws", "connected");
      setConnectionStatus("connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case "connected":
            setNPCInfo(msg.npc);
            break;

          case "transcript":
            eventLogger.log("ws", "recv_transcript", { text: msg.text, isFinal: msg.isFinal });
            currentTranscriptRef.current = msg.text;
            setCurrentTranscript(msg.text);
            break;

          case "npc_text":
            currentNPCTextRef.current += msg.text;
            setCurrentNPCText(currentNPCTextRef.current);
            // Log first chunk only to avoid flood
            if (currentNPCTextRef.current.length === msg.text.length) {
              eventLogger.log("ws", "recv_npc_text_start", { chunk: msg.text });
            }
            break;

          case "npc_audio":
            if (audioSuppressedRef.current) break; // Discard post-barge-in stragglers
            eventLogger.audioReceived();
            onAudioChunkRef.current?.(msg.data);
            break;

          case "npc_done": {
            eventLogger.log("ws", "recv_npc_done", { npcTextLength: currentNPCTextRef.current.length });
            // Finalize messages — read from refs to avoid nesting setMessages
            const transcript = currentTranscriptRef.current;
            const npcText = currentNPCTextRef.current;
            const newMessages: ChatMessage[] = [];
            if (transcript) {
              newMessages.push({
                id: `player-${Date.now()}`,
                role: "player",
                text: transcript,
                timestamp: Date.now(),
              });
            }
            if (npcText) {
              newMessages.push({
                id: `npc-${Date.now()}`,
                role: "npc",
                text: npcText,
                timestamp: Date.now(),
              });
            }
            if (newMessages.length > 0) {
              setMessages((prev) => [...prev, ...newMessages]);
            }
            currentTranscriptRef.current = "";
            currentNPCTextRef.current = "";
            setCurrentTranscript("");
            setCurrentNPCText("");
            break;
          }

          case "status":
            eventLogger.log("pipeline", "status_change", { status: msg.status });
            setPipelineStatus(msg.status);
            // New response cycle — allow audio again
            if (msg.status === "processing") {
              audioSuppressedRef.current = false;
            }
            // When processing starts, finalize the player transcript
            if (msg.status === "processing") {
              const transcript = currentTranscriptRef.current;
              if (transcript) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `player-${Date.now()}`,
                    role: "player",
                    text: transcript,
                    timestamp: Date.now(),
                  },
                ]);
                currentTranscriptRef.current = "";
                setCurrentTranscript("");
              }
            }
            break;

          case "barge_in":
            eventLogger.log("pipeline", "barge_in");
            audioSuppressedRef.current = true;
            onBargeInRef.current?.();
            break;

          case "error":
            eventLogger.log("error", "server_error", { message: msg.message });
            console.error("[Session] Server error:", msg.message);
            break;
        }
      } catch {
        console.error("[Session] Failed to parse message");
      }
    };

    ws.onclose = () => {
      console.log("[Session] Disconnected");
      eventLogger.log("ws", "disconnected");
      setConnectionStatus("disconnected");
      wsRef.current = null;
      // Auto-reconnect after 2 seconds
      reconnectTimeoutRef.current = setTimeout(connect, 2000);
    };

    ws.onerror = (err) => {
      eventLogger.log("error", "ws_error", { error: String(err) });
      console.error("[Session] WebSocket error:", err);
    };
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
    setConnectionStatus("disconnected");
  }, []);

  const sendMessage = useCallback((data: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const sendAudio = useCallback(
    (base64: string) => {
      eventLogger.audioSent();
      sendMessage({ type: "audio", data: base64 });
    },
    [sendMessage]
  );

  const startRecording = useCallback(() => {
    eventLogger.log("ws", "send_start_recording");
    sendMessage({ type: "start_recording" });
  }, [sendMessage]);

  const stopRecording = useCallback(() => {
    eventLogger.log("ws", "send_stop_recording");
    sendMessage({ type: "stop_recording" });
  }, [sendMessage]);

  const sendTextInput = useCallback(
    (text: string) => {
      eventLogger.log("ws", "send_text_input", { text });
      sendMessage({ type: "text_input", text });
    },
    [sendMessage]
  );

  // Connect on mount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    connectionStatus,
    pipelineStatus,
    messages,
    currentTranscript,
    currentNPCText,
    npcInfo,
    sendAudio,
    startRecording,
    stopRecording,
    sendTextInput,
    onAudioChunkRef,
    onBargeInRef,
  };
}
