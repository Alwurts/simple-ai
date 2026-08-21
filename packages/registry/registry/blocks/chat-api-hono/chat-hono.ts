import { Hono } from "hono";
import { handleAgent } from "@/features/assistant/lib/handle-agent";

/** POST /api/chat. Mount with `app.route("/", chatApp)` or `chatApp.fetch(request)`. */
export const chatApp = new Hono().post("/api/chat", (c) =>
  handleAgent(c.req.raw)
);
