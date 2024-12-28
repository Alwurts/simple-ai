import { createContentlayerPlugin } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		outputFileTracingIncludes: {
			"/blocks/*": ["./registry/**/*"],
		},
	},
};

const withContentlayer = createContentlayerPlugin({
	// Additional Contentlayer config options
});

export default withContentlayer(nextConfig);
