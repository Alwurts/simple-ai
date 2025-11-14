import type { InferUITools, UIMessage } from "ai";
import type { toolSet } from "@/registry/blocks/chat-01/lib/tools";

export type AIUIMessage = UIMessage<never, InferUITools<typeof toolSet>>;
