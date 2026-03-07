"use client";

import { useCallback, useRef, useState } from "react";
import { eventLogger } from "@/lib/event-logger";

export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef(0);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext({ sampleRate: 24000 });
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playChunk = useCallback(
    (base64Pcm16: string) => {
      const ctx = getContext();

      // Decode base64 → Int16Array → Float32Array
      const binaryStr = atob(base64Pcm16);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      // Create audio buffer
      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);

      // Schedule playback
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const now = ctx.currentTime;
      const startTime = Math.max(now, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;

      const wasEmpty = sourcesRef.current.length === 0;
      sourcesRef.current.push(source);
      if (wasEmpty) {
        eventLogger.log("playback", "playback_started");
      }
      setIsPlaying(true);

      source.onended = () => {
        const idx = sourcesRef.current.indexOf(source);
        if (idx === -1) return; // Already removed by stop()
        sourcesRef.current.splice(idx, 1);
        if (sourcesRef.current.length === 0) {
          eventLogger.log("playback", "playback_ended");
          setIsPlaying(false);
        }
      };
    },
    [getContext]
  );

  const stop = useCallback(() => {
    const count = sourcesRef.current.length;
    if (count === 0) return;
    eventLogger.log("playback", "playback_stopped", { pendingSources: count });
    // Clear array first so onended callbacks don't fire playback_ended
    const sources = sourcesRef.current;
    sourcesRef.current = [];
    sources.forEach((s) => {
      try {
        s.stop();
      } catch {
        // Already stopped
      }
    });
    nextPlayTimeRef.current = 0;
    setIsPlaying(false);
  }, []);

  return { playChunk, stop, isPlaying };
}
