import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env } from "@/env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	secret: env.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true,
	},
});
