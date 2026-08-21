import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";

/**
 * Shared UI-message chat handler. Adapters (Next, Hono, Start) pass the Request in.
 * Set `AI_MODEL` (AI Gateway id, e.g. `openai/gpt-4.1-mini`) and a provider or
 * `AI_GATEWAY_API_KEY`.
 */
export async function handleChat(request: Request): Promise<Response> {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: process.env.AI_MODEL ?? "openai/gpt-4.1-mini",
    instructions: "You are a helpful assistant.",
    messages: await convertToModelMessages(messages, {
      ignoreIncompleteToolCalls: true,
    }),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
