import { Hono } from "hono";
import { generateResponse } from "@/lib/ai/generate-response";
import type { HonoContextWithAuth } from "@/types/hono";

const chatRoutes = new Hono<HonoContextWithAuth>().post("/", async (c) => {
	const { messages } = await c.req.json();
	return generateResponse({ messages });
});

export default chatRoutes;
