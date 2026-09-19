/**
 * Default install uses a mocked transport (no model).
 * Point a live transport at your own API when you have one:
 *
 *   import { DefaultChatTransport } from "ai";
 *   export const chatTransport = new DefaultChatTransport({ api: "/api/chat" });
 *   export const initialChatMessages = undefined;
 */
export {
  type CardChatMessage,
  galleryChatTransport as chatTransport,
  initialGalleryMessages as initialChatMessages,
} from "./mock-chat-messages";
