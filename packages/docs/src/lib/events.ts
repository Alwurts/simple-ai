import { usePlausible } from "next-plausible";
import { z } from "zod";

declare global {
	interface Window {
		gtag: (
			command: "event",
			action: string,
			params?: Record<string, unknown>,
		) => void;
	}
}

const eventSchema = z.object({
	name: z.enum([
		"copy_npm_command",
		"copy_block_code",
		"block_used",
		"ai_agent_used",
		"example_used",
	]),
	properties: z
		.record(
			z.string(),
			z.union([z.string(), z.number(), z.boolean(), z.null()]),
		)
		.optional(),
});

export type Event = z.infer<typeof eventSchema>;

// Track with Google Analytics
function trackGoogleAnalytics(event: Event) {
	if (typeof window !== "undefined") {
		window.gtag("event", event.name, event.properties);
	}
}

// Custom hook for tracking events with both GA and Plausible
export function useTrackEvent() {
	const plausible = usePlausible();

	return (input: Event) => {
		console.log("useTrackEvent", input);
		const event = eventSchema.parse(input);

		// Track with Google Analytics
		trackGoogleAnalytics(event);

		// Track with Plausible
		plausible(event.name, {
			props: event.properties,
		});
	};
}

// For non-React contexts
export function trackEvent(input: Event): void {
	console.log("inputtrackEvent", input);

	const event = eventSchema.parse(input);
	// Only track with Google Analytics in non-React contexts
	trackGoogleAnalytics(event);
}

// TODO: Rework tracking to be only plausible
