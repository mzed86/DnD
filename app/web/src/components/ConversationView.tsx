"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/hooks/useSession";

interface ConversationViewProps {
  messages: ChatMessage[];
  currentTranscript: string;
  currentNPCText: string;
}

export function ConversationView({
  messages,
  currentTranscript,
  currentNPCText,
}: ConversationViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentTranscript, currentNPCText]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.length === 0 && !currentTranscript && !currentNPCText && (
        <p className="text-center text-gray-600 text-sm mt-8">
          Hold the Talk button and speak to begin.
        </p>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role} text={msg.text} />
      ))}

      {/* Current player transcript (in-progress) */}
      {currentTranscript && (
        <MessageBubble role="player" text={currentTranscript} isLive />
      )}

      {/* Current NPC response (in-progress) */}
      {currentNPCText && (
        <MessageBubble role="npc" text={currentNPCText} isLive />
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({
  role,
  text,
  isLive,
}: {
  role: "player" | "npc";
  text: string;
  isLive?: boolean;
}) {
  const isPlayer = role === "player";

  return (
    <div className={`flex ${isPlayer ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isPlayer
            ? "bg-gray-700 text-gray-100"
            : "bg-amber-900/40 text-amber-100 border border-amber-800/30"
        } ${isLive ? "opacity-70" : ""}`}
      >
        <p className="text-xs font-medium mb-1 opacity-60">
          {isPlayer ? "You" : "Mira"}
        </p>
        <p className="text-sm leading-relaxed">
          {text}
          {isLive && (
            <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse" />
          )}
        </p>
      </div>
    </div>
  );
}
