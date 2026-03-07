import type { PipelineStatus } from "@/hooks/useSession";

interface StatusIndicatorProps {
  status: PipelineStatus;
}

const statusConfig: Record<PipelineStatus, { label: string; color: string }> = {
  idle: { label: "Ready", color: "text-gray-500" },
  listening: { label: "Listening...", color: "text-emerald-400" },
  processing: { label: "Thinking...", color: "text-amber-400" },
  speaking: { label: "Speaking...", color: "text-blue-400" },
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const { label, color } = statusConfig[status];

  return (
    <div className={`text-sm font-medium ${color} flex items-center gap-2`}>
      {status !== "idle" && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color.replace("text-", "bg-")}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${color.replace("text-", "bg-")}`}
          />
        </span>
      )}
      {label}
    </div>
  );
}
