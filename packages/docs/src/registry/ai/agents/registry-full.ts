import { exaAgent } from "@/registry/ai/agents/exa-agent";
import { firecrawlAgent } from "@/registry/ai/agents/firecrawl-agent";
import { weatherAgent } from "@/registry/ai/agents/weather-agent";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";

export const agents = {
	"weather-agent": weatherAgent,
	"exa-agent": exaAgent,
	"firecrawl-agent": firecrawlAgent,
	// Import and add more agents here
};

export const agentsList = Object.keys(agents).map((key) => ({
	id: key,
	name: idToReadableText(key),
}));

export type agentId = keyof typeof agents;

export const AGENTS = Object.keys(agents);
