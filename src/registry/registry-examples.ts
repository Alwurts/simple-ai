import { BASE_URL } from "@/lib/config";
import type { Registry } from "@/shadcn-temp/schema";

export const examples: Registry["items"] = [
	{
		name: "chat-input-demo",
		type: "registry:example",
		registryDependencies: [`${BASE_URL}/r/chat-input.json`],
		files: [
			{
				path: "examples/chat-input-demo.tsx",
				type: "registry:example",
			},
		],
	},
];
