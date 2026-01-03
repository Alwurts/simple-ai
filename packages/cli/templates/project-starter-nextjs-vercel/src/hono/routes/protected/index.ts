import { Hono } from "hono";
import type { HonoContext } from "@/types/hono";
import { honoAuthCheckMiddleware, honoAuthMiddleware } from "../../middleware/auth";
import chatRoutes from "./chat";
import itemsRoutes from "./items";

const protectedRoutes = new Hono<HonoContext>()
	.use(honoAuthMiddleware)
	.use(honoAuthCheckMiddleware)
	.route("/items", itemsRoutes)
	.route("/chat", chatRoutes);

export default protectedRoutes;
