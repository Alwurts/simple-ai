import { Hono } from "hono";
import { handleChat } from "@/features/assistant/lib/chat-handler";

/** POST /api/chat. Mount with `app.route("/", chatApp)` or `chatApp.fetch(request)`. */
export const chatApp = new Hono().post("/api/chat", (c) =>
  handleChat(c.req.raw)
);
