import { Hono } from "hono";
import type { HonoContext } from "@/types/hono";
import { honoAuthMiddleware } from "../../middleware/auth";
import contactRoutes from "./contact";
import statusRoutes from "./status";

const publicRoutes = new Hono<HonoContext>()
	.use(honoAuthMiddleware)
	.route("/status", statusRoutes)
	.route("/contact", contactRoutes);

export default publicRoutes;
