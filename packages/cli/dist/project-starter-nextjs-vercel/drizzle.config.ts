import { defineConfig } from "drizzle-kit";

const postgresUrl = process.env.POSTGRES_URL;

if (!postgresUrl) {
	throw new Error("POSTGRES_URL is not set");
}

export default defineConfig({
	schema: "./src/db/schema/*",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: postgresUrl,
	},
});
