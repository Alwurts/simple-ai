import { Hono } from "hono";
import type { HonoContext } from "@/types/hono";
import { honoAuthCheckMiddleware, honoAuthMiddleware } from "../../middleware/auth";
import chatRoutes from "./chat";
import inventoryRoutes from "./inventory";

const protectedRoutes = new Hono<HonoContext>()
	.use(honoAuthMiddleware)
	.use(honoAuthCheckMiddleware)
	.route("/chat", chatRoutes)
	.route("/inventory", inventoryRoutes);

export default protectedRoutes;
