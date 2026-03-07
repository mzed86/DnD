"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useAudioCapture } from "@/hooks/useAudioCapture";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { NPCHeader } from "@/components/NPCHeader";
import { ConversationView } from "@/components/ConversationView";
import { TalkButton } from "@/components/TalkButton";
import { StatusIndicator } from "@/components/StatusIndicator";
import { ModeToggle } from "@/components/ModeToggle";
import { eventLogger } from "@/lib/event-logger";

export default function Home() {
  const session = useSession();
  const playback = useAudioPlayback();

  // Suppress VAD when pipeline is not idle (prevents echo/NPC audio triggering)
  const vadSuppressedRef = useRef(false);
  useEffect(() => {
    vadSuppressedRef.current =
      session.pipelineStatus === "speaking" || session.pipelineStatus === "processing";
  }, [session.pipelineStatus]);

  const handleSpeechStart = useCallback(() => {
    if (playback.isPlaying) {
      playback.stop();
    }
    session.startRecording();
  }, [session, playback]);

  const handleSpeechEnd = useCallback(() => {
    session.stopRecording();
  }, [session]);

  const capture = useAudioCapture({
    onAudioChunk: session.sendAudio,
    onSpeechStart: handleSpeechStart,
    onSpeechEnd: handleSpeechEnd,
    vadSuppressedRef,
  });

  // Wire up audio playback from session
  useEffect(() => {
    session.onAudioChunkRef.current = playback.playChunk;
  }, [session, playback.playChunk]);

  // Wire up barge-in
  useEffect(() => {
    session.onBargeInRef.current = playback.stop;
  }, [session, playback.stop]);

  // Eagerly request mic permission when connected so first PTT is instant
  useEffect(() => {
    if (session.connectionStatus === "connected") {
      capture.warmup();
    }
  }, [session.connectionStatus, capture.warmup]);

  // Handle mode changes
  useEffect(() => {
    if (capture.mode === "vad" && session.connectionStatus === "connected") {
      // Don't send start_recording here — the VAD's onSpeechStart callback
      // handles that when speech is actually detected
      capture.startVAD();
    } else {
      capture.stopVAD();
    }
  }, [capture.mode, session.connectionStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => capture.cleanup();
  }, []);

  const handlePTTStart = useCallback(() => {
    eventLogger.log("ui", "ptt_press");
    // Immediate client-side barge-in: stop NPC audio before server responds
    if (playback.isPlaying) {
      playback.stop();
    }
    capture.startRecording();
  }, [capture, playback]);

  const handlePTTEnd = useCallback(() => {
    eventLogger.log("ui", "ptt_release");
    capture.stopRecording();
  }, [capture]);

  const isConnected = session.connectionStatus === "connected";

  const [debugText, setDebugText] = useState("");

  return (
    <div className="flex flex-col h-dvh max-w-lg mx-auto bg-[#141418]">
      <NPCHeader
        name={session.npcInfo?.name ?? "Mira Ashvane"}
        description={session.npcInfo?.description ?? "The Brine & Barrel"}
        connectionStatus={session.connectionStatus}
      />

      <ConversationView
        messages={session.messages}
        currentTranscript={session.currentTranscript}
        currentNPCText={session.currentNPCText}
      />

      <div className="border-t border-gray-800 px-6 py-4 flex flex-col items-center gap-3">
        <StatusIndicator status={session.pipelineStatus} />

        {capture.mode === "ptt" ? (
          <TalkButton
            isRecording={capture.isRecording}
            isConnected={isConnected}
            onPressStart={handlePTTStart}
            onPressEnd={handlePTTEnd}
          />
        ) : (
          <div className="flex items-center gap-2 h-20">
            <span
              className={`inline-block h-3 w-3 rounded-full ${
                capture.isRecording
                  ? "bg-red-500 animate-pulse"
                  : "bg-gray-600"
              }`}
            />
            <span className="text-sm text-gray-400">
              {capture.isRecording ? "Listening..." : "Waiting for speech..."}
            </span>
          </div>
        )}

        <ModeToggle mode={capture.mode} onModeChange={capture.setMode} />

        {/* Debug text input — type to test without mic */}
        <form
          className="flex gap-2 w-full mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (debugText.trim() && isConnected) {
              session.sendTextInput(debugText.trim());
              setDebugText("");
            }
          }}
        >
          <input
            type="text"
            value={debugText}
            onChange={(e) => setDebugText(e.target.value)}
            placeholder="Type to test (bypasses mic)..."
            disabled={!isConnected || session.pipelineStatus !== "idle"}
            className="flex-1 bg-gray-800 text-gray-200 text-sm rounded px-3 py-2 border border-gray-700 placeholder-gray-500 disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={!isConnected || session.pipelineStatus !== "idle" || !debugText.trim()}
            className="bg-amber-600 text-white text-sm px-3 py-2 rounded disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
