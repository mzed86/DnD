"use client";

import { useCallback, useRef, useState } from "react";
import { eventLogger } from "@/lib/event-logger";

export type CaptureMode = "ptt" | "vad";

interface UseAudioCaptureOptions {
  onAudioChunk: (base64: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  /** When true, VAD will not trigger new recordings (e.g. NPC is speaking). */
  vadSuppressedRef?: React.RefObject<boolean>;
}

/**
 * Downsample float32 audio from sourceSR to targetSR.
 * Simple linear interpolation — good enough for speech.
 */
function downsample(
  buffer: Float32Array,
  sourceSR: number,
  targetSR: number
): Float32Array {
  if (sourceSR === targetSR) return buffer;
  const ratio = sourceSR / targetSR;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const srcIdx = i * ratio;
    const low = Math.floor(srcIdx);
    const high = Math.min(low + 1, buffer.length - 1);
    const frac = srcIdx - low;
    result[i] = buffer[low] * (1 - frac) + buffer[high] * frac;
  }
  return result;
}

/** Convert Float32 [-1,1] samples to Int16 PCM and return base64. */
function float32ToBase64PCM(samples: Float32Array): string {
  const int16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const TARGET_SAMPLE_RATE = 16000;
// ScriptProcessorNode buffer size — 4096 samples at 48kHz ≈ 85ms chunks
const BUFFER_SIZE = 4096;

export function useAudioCapture({
  onAudioChunk,
  onSpeechStart,
  onSpeechEnd,
  vadSuppressedRef,
}: UseAudioCaptureOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState<CaptureMode>("ptt");
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadActiveRef = useRef(false);
  const vadFrameRef = useRef<number>(0);
  const vadSilenceCountRef = useRef(0);
  const vadSpeechCountRef = useRef(0);
  const isRecordingRef = useRef(false);
  // Store callback refs so the ScriptProcessor/VAD always uses the latest
  const onAudioChunkRef = useRef(onAudioChunk);
  onAudioChunkRef.current = onAudioChunk;
  const onSpeechStartRef = useRef(onSpeechStart);
  onSpeechStartRef.current = onSpeechStart;
  const onSpeechEndRef = useRef(onSpeechEnd);
  onSpeechEndRef.current = onSpeechEnd;

  const VAD_THRESHOLD = 0.04;
  const VAD_SPEECH_FRAMES = 8;    // ~133ms of speech to trigger start
  const VAD_SILENCE_FRAMES = 35;  // ~580ms of silence to trigger end

  const ensureAudioContext = useCallback(async () => {
    if (!streamRef.current) {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        },
      });
    }
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext({ sampleRate: 48000 });
    }
    if (audioCtxRef.current.state === "suspended") {
      await audioCtxRef.current.resume();
    }

    if (!sourceRef.current) {
      sourceRef.current = audioCtxRef.current.createMediaStreamSource(
        streamRef.current
      );
    }

    return {
      stream: streamRef.current,
      ctx: audioCtxRef.current,
      source: sourceRef.current,
    };
  }, []);

  const startRecording = useCallback(async () => {
    const { ctx, source } = await ensureAudioContext();

    // Create ScriptProcessor for raw PCM capture
    const processor = ctx.createScriptProcessor(BUFFER_SIZE, 1, 1);
    processor.onaudioprocess = (e) => {
      if (!isRecordingRef.current) return;
      const inputData = e.inputBuffer.getChannelData(0);
      const downsampled = downsample(inputData, ctx.sampleRate, TARGET_SAMPLE_RATE);
      const base64 = float32ToBase64PCM(downsampled);
      onAudioChunkRef.current(base64);
    };
    source.connect(processor);
    processor.connect(ctx.destination); // Required for ScriptProcessor to fire
    processorRef.current = processor;

    isRecordingRef.current = true;
    setIsRecording(true);
    eventLogger.log("capture", "recording_started", { sampleRate: ctx.sampleRate });
    onSpeechStartRef.current?.();
  }, [ensureAudioContext]);

  const stopRecording = useCallback(() => {
    isRecordingRef.current = false;
    setIsRecording(false);
    eventLogger.log("capture", "recording_stopped");

    // Disconnect processor
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    onSpeechEndRef.current?.();
  }, []);

  // VAD monitoring
  const startVAD = useCallback(async () => {
    const { ctx, source } = await ensureAudioContext();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Float32Array(analyser.fftSize);

    const checkLevel = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getFloatTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length);

      if (rms > VAD_THRESHOLD) {
        vadSpeechCountRef.current++;
        vadSilenceCountRef.current = 0;

        if (
          !vadActiveRef.current &&
          vadSpeechCountRef.current >= VAD_SPEECH_FRAMES &&
          !vadSuppressedRef?.current
        ) {
          vadActiveRef.current = true;
          eventLogger.log("capture", "vad_speech_start", { rms });
          startRecording();
        }
      } else {
        vadSilenceCountRef.current++;
        vadSpeechCountRef.current = 0;

        if (
          vadActiveRef.current &&
          vadSilenceCountRef.current >= VAD_SILENCE_FRAMES
        ) {
          vadActiveRef.current = false;
          eventLogger.log("capture", "vad_speech_end", { silenceFrames: vadSilenceCountRef.current });
          stopRecording();
        }
      }

      vadFrameRef.current = requestAnimationFrame(checkLevel);
    };

    vadFrameRef.current = requestAnimationFrame(checkLevel);
  }, [ensureAudioContext, startRecording, stopRecording]);

  const stopVAD = useCallback(() => {
    if (vadFrameRef.current) {
      cancelAnimationFrame(vadFrameRef.current);
      vadFrameRef.current = 0;
    }
    if (vadActiveRef.current) {
      stopRecording();
      vadActiveRef.current = false;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
  }, [stopRecording]);

  const cleanup = useCallback(() => {
    stopVAD();
    stopRecording();
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  }, [stopVAD, stopRecording]);

  // Eagerly request mic permission so the first PTT press is instant
  const warmup = useCallback(async () => {
    try {
      await ensureAudioContext();
      eventLogger.log("capture", "mic_ready");
    } catch (err) {
      eventLogger.log("error", "mic_permission_failed", { error: String(err) });
    }
  }, [ensureAudioContext]);

  return {
    isRecording,
    mode,
    setMode,
    startRecording,
    stopRecording,
    startVAD,
    stopVAD,
    cleanup,
    warmup,
  };
}
