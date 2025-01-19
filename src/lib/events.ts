import { z } from "zod";
import { usePlausible } from "next-plausible";

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
		"copy_usage_import_code",
		"copy_usage_code",
		"copy_primitive_code",
		"copy_theme_code",
		"copy_block_code",
		"copy_chunk_code",
		"enable_lift_mode",
		"copy_chart_code",
		"copy_chart_theme",
		"copy_chart_data",
		"copy_color",
	]),
	properties: z
		.record(z.union([z.string(), z.number(), z.boolean(), z.null()]))
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
	const event = eventSchema.parse(input);
	// Only track with Google Analytics in non-React contexts
	trackGoogleAnalytics(event);
}
