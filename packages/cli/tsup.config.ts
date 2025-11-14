import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	entry: ["src/cli.ts"],
	format: ["esm"],
	target: "node18",
	clean: true,
	banner: {
		js: "#!/usr/bin/env node",
	},
	shims: false,
	// Copy the templates directory into the dist folder
	publicDir: path.resolve(__dirname, "../../packages/templates"),
	// Ensure the file is executable
	outExtension() {
		return {
			js: ".js",
		};
	},
});
