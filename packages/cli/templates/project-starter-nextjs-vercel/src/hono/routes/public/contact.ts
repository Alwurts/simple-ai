import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { HonoContext } from "@/types/hono";

const contactSchema = z.object({
	name: z.string().min(1).describe("Name is required"),
	email: z.email().describe("Invalid email address"),
	message: z.string().min(10).describe("Message must be at least 10 characters"),
});

const contactRoutes = new Hono<HonoContext>()
	.post("/", zValidator("json", contactSchema), async (c) => {
		const { name, email, message } = c.req.valid("json");

		// In a real application, you would send this to an email service
		// For now, we'll just log it and return a success response
		console.log("Contact form submission:", { name, email, message });

		return c.json({
			success: true,
			message: "Thank you for your message! We'll get back to you soon.",
			timestamp: new Date().toISOString(),
		});
	})
	.get("/", async (c) => {
		return c.json({
			message: "Contact form endpoint",
			method: "POST",
			schema: {
				name: "string (required)",
				email: "string (email, required)",
				message: "string (min 10 chars, required)",
			},
		});
	});

export default contactRoutes;
