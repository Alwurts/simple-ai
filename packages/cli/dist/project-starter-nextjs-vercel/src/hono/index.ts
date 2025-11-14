import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@/lib/auth";
import { BASE_URL } from "@/lib/config";
import protectedRoutes from "./routes/protected";
import publicRoutes from "./routes/public";

export const app = new Hono().basePath("/api").use(
	"*",
	cors({
		origin: BASE_URL,
		allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
		allowHeaders: ["Content-Type", "Authorization"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

// Add both public and protected routes
const routes = app.route("/", publicRoutes).route("/", protectedRoutes);

export type AppType = typeof routes;
