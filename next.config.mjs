import { createContentlayerPlugin } from "next-contentlayer2";
import { withPlausibleProxy } from "next-plausible";

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy({
	customDomain: "https://plausible.alwurts.com"
})({
	experimental: {
		outputFileTracingIncludes: {
			"/blocks/*": ["./registry/**/*"],
		},
	},
});

const withContentlayer = createContentlayerPlugin({
	// Additional Contentlayer config options
});

export default withContentlayer(nextConfig);
