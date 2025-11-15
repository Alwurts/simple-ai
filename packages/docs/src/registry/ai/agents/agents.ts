import { searchAgent } from "@/registry/ai/agents/search-agent";
import { weatherAgent } from "@/registry/ai/agents/weather-agent";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";

export const agents = {
	"weather-agent": weatherAgent,
	"search-agent": searchAgent,
	// Import and add more agents here
};

export const agentsList = Object.keys(agents).map((key) => ({
	id: key,
	name: idToReadableText(key),
}));

export type agentId = keyof typeof agents;

export const AGENTS = Object.keys(agents);
