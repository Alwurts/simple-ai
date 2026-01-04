import { Hono } from "hono";
import type { HonoContext } from "@/types/hono";

const statusRoutes = new Hono<HonoContext>().get("/", async (c) => {
	return c.json({
		status: "ok",
		version: "1.0.0",
		features: ["authentication", "api"],
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

export default statusRoutes;
