import { Hono } from "hono";
import type { HonoContext } from "@/types/hono";
import { honoAuthCheckMiddleware, honoAuthMiddleware } from "../../middleware/auth";
import todosRoutes from "./todos";

const protectedRoutes = new Hono<HonoContext>()
	.use(honoAuthMiddleware)
	.use(honoAuthCheckMiddleware)
	.route("/todos", todosRoutes);

export default protectedRoutes;
