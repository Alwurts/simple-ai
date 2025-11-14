import { env } from "@/env";

export const BASE_URL = (() => {
	const vercelPublicEnvironment = env.NEXT_PUBLIC_VERCEL_ENV;
	const vercelPublicBranchUrl = env.NEXT_PUBLIC_VERCEL_BRANCH_URL;
	const vercelPublicProductionUrl = env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
	if (process.env.NODE_ENV === "development") {
		return "http://localhost:3000";
	}
	if (vercelPublicEnvironment === "production" && vercelPublicProductionUrl) {
		return `https://${vercelPublicProductionUrl}`;
	}
	if (vercelPublicEnvironment === "preview" && vercelPublicBranchUrl) {
		return `https://${vercelPublicBranchUrl}`;
	}
	return "http://localhost:3000";
})();
