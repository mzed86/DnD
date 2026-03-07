import type { ConnectionStatus } from "@/hooks/useSession";

interface NPCHeaderProps {
  name: string;
  description: string;
  connectionStatus: ConnectionStatus;
}

const statusColors: Record<ConnectionStatus, string> = {
  connected: "bg-emerald-500",
  connecting: "bg-amber-500 animate-pulse",
  disconnected: "bg-red-500",
};

const statusLabels: Record<ConnectionStatus, string> = {
  connected: "Connected",
  connecting: "Connecting...",
  disconnected: "Disconnected",
};

export function NPCHeader({
  name,
  description,
  connectionStatus,
}: NPCHeaderProps) {
  return (
    <div className="border-b border-gray-800 px-6 py-4">
      <h1 className="text-xl font-semibold text-amber-500">{name}</h1>
      <p className="text-sm text-gray-400">{description}</p>
      <div className="mt-1 flex items-center gap-2">
        <span
          className={`inline-block h-2 w-2 rounded-full ${statusColors[connectionStatus]}`}
        />
        <span className="text-xs text-gray-500">
          {statusLabels[connectionStatus]}
        </span>
      </div>
    </div>
  );
}
