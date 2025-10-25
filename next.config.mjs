import { createMDX } from "fumadocs-mdx/next";
import { withPlausibleProxy } from "next-plausible";

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy({
	customDomain: "https://plausible.alwurts.com",
})({
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
});
const withMDX = createMDX({});

export default withMDX(nextConfig);
