import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config.js";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

export async function* streamNPCResponse(
  systemPrompt: string,
  history: ConversationMessage[],
  playerMessage: string
): AsyncGenerator<string> {
  const startTime = Date.now();

  const stream = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: systemPrompt,
    messages: [...history, { role: "user", content: playerMessage }],
    stream: true,
  });

  let firstToken = true;
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      if (firstToken) {
        console.log(`[LLM] First token: ${Date.now() - startTime}ms`);
        firstToken = false;
      }
      yield event.delta.text;
    }
  }
  console.log(`[LLM] Stream complete: ${Date.now() - startTime}ms`);
}
