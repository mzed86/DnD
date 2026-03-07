"use client";

import { useCallback } from "react";

interface TalkButtonProps {
  isRecording: boolean;
  isConnected: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
}

export function TalkButton({
  isRecording,
  isConnected,
  onPressStart,
  onPressEnd,
}: TalkButtonProps) {
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (isConnected) onPressStart();
    },
    [isConnected, onPressStart]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      onPressEnd();
    },
    [onPressEnd]
  );

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
      disabled={!isConnected}
      className={`
        relative w-20 h-20 rounded-full
        transition-all duration-150 select-none touch-none
        ${
          isRecording
            ? "bg-red-600 scale-110 shadow-lg shadow-red-900/50"
            : isConnected
              ? "bg-gray-700 hover:bg-gray-600 active:scale-95"
              : "bg-gray-800 opacity-50 cursor-not-allowed"
        }
      `}
    >
      {/* Pulse ring when recording */}
      {isRecording && (
        <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
      )}

      {/* Mic icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 mx-auto text-gray-100"
      >
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>

      <span className="block text-[10px] text-gray-300 mt-0.5">
        {isRecording ? "Release" : "Hold"}
      </span>
    </button>
  );
}
