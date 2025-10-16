import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
} from "fumadocs-mdx/config";
import rehypePrettyCode from "rehype-pretty-code";
import { z } from "zod";

import { transformers } from "@/lib/highlight-code";

export default defineConfig({
	mdxOptions: {
		rehypePlugins: (plugins) => {
			plugins.shift();
			plugins.push([
				rehypePrettyCode,
				{
					theme: {
						dark: "github-dark",
						light: "github-light-default",
					},
					transformers,
				},
			]);

			return plugins;
		},
	},
});

export const docs = defineDocs({
	dir: "src/content/docs",
	docs: {
		schema: frontmatterSchema.extend({
			links: z
				.object({
					doc: z.string().optional(),
					api: z.string().optional(),
				})
				.optional(),
		}),
		// postprocess: {
		// 	includeProcessedMarkdown: true,
		// },
	},
});
