import { createAgentUIStreamResponse } from "ai";
import { assistant } from "@/features/assistant/lib/agent";

export async function handleAgent(request: Request): Promise<Response> {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({
    abortSignal: request.signal,
    agent: assistant,
    uiMessages: messages,
  });
}
