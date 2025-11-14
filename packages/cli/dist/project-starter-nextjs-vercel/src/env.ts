import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/*
	 * Serverside Environment variables, not available on the client.
	 * Will throw if you access these variables on the client.
	 */
	server: {
		// Database
		POSTGRES_URL: z.string().min(1),
		// Better Auth
		BETTER_AUTH_SECRET: z.string().min(1),
	},
	/*
	 * Environment variables available on the client (and server).
	 *
	 * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
	 */
	client: {
		NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
		NEXT_PUBLIC_VERCEL_BRANCH_URL: z.string().optional(),
		NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
	},
	/*
	 * Due to how Next.js bundles environment variables on Edge and Client,
	 * we need to manually destructure them to make sure all are included in bundle.
	 *
	 * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
	 */
	runtimeEnv: {
		// Database
		POSTGRES_URL: process.env.POSTGRES_URL,
		// Better Auth
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		// Vercel
		NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
		NEXT_PUBLIC_VERCEL_BRANCH_URL: process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,
		NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
			process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
	},
});
