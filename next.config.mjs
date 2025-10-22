import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
	devIndicators: false,
	outputFileTracingIncludes: {
		"/*": ["./src/registry/**/*"],
	},
	redirects: async () => {
		return [
			{
				source: "/docs/react-flow/:slug",
				destination: "/docs/workflows/:slug",
				permanent: true,
			},
			{
				source: "/docs/react-flow",
				destination: "/docs/workflows",
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
