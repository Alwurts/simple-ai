/**
 * Default install uses a mocked transport (no model).
 * After adding an agent and @simple-ai/chat-api-next or @simple-ai/chat-api-hono:
 *
 *   import { DefaultChatTransport } from "ai";
 *   export const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
 *   export const initialChatMessages = undefined;
 */
export {
  type GalleryChatMessage,
  galleryChatTransport as chatTransport,
  initialGalleryMessages as initialChatMessages,
} from "./mock-chat-messages";
