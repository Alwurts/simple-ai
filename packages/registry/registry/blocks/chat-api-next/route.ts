import { handleAgent } from "@/features/assistant/lib/handle-agent";

export const maxDuration = 60;

export function POST(request: Request) {
  return handleAgent(request);
}
