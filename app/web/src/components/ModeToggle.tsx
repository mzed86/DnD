import type { CaptureMode } from "@/hooks/useAudioCapture";

interface ModeToggleProps {
  mode: CaptureMode;
  onModeChange: (mode: CaptureMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-3 text-xs text-gray-400">
      <button
        onClick={() => onModeChange("ptt")}
        className={`px-2 py-1 rounded ${
          mode === "ptt"
            ? "bg-gray-700 text-gray-200"
            : "hover:text-gray-300"
        }`}
      >
        PTT
      </button>
      <span className="text-gray-600">|</span>
      <button
        onClick={() => onModeChange("vad")}
        className={`px-2 py-1 rounded ${
          mode === "vad"
            ? "bg-gray-700 text-gray-200"
            : "hover:text-gray-300"
        }`}
      >
        VAD
      </button>
    </div>
  );
}
