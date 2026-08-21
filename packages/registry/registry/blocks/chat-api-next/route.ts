import { handleChat } from "@/features/assistant/lib/chat-handler";

export const maxDuration = 60;

export function POST(request: Request) {
  return handleChat(request);
}
