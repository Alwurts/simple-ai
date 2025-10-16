import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
	outputFileTracingIncludes: {
		"/*": ["./src/registry/**/*"],
	},
	redirects: async () => {
		return [
			{
				source: "/docs/components/chat-message-area",
				destination: "/docs/components/message-area",
				permanent: true,
			},
		];
	},
	rewrites: async () => {
		return [
			{
				source: "/docs/:path*.md",
				destination: "/llm/:path*",
			},
		];
	},
};
const withMDX = createMDX({});

export default withMDX(nextConfig);
