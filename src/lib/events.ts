import { z } from "zod";

declare global {
	interface Window {
		gtag: (
			command: "event",
			action: string,
			params?: {
				[key: string]: string | number | boolean | null | undefined;
				event_category?: string;
				event_label?: string;
				value?: number;
			},
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

export function trackEvent(input: Event): void {
	const event = eventSchema.parse(input);
	if (event && typeof window !== "undefined") {
		// Transform properties to GA4 format
		const gaEventParams = {
			...event.properties,
			event_category: "user_interaction",
			event_label: event.properties?.name || event.name,
		};

		// Send to GA4
		window.gtag("event", event.name, gaEventParams);

		// Log in development
		if (process.env.NODE_ENV === "development") {
			console.log("[GA Event]", event.name, gaEventParams);
		}
	}
}
