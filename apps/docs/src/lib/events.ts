export interface AnalyticsEvent {
  name:
    | "copy_npm_command"
    | "copy_block_code"
    | "block_used"
    | "ai_agent_used"
    | "example_used";
  properties?: Record<string, string | number | boolean | null>;
}

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      action: string,
      params?: Record<string, unknown>
    ) => void;
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean | null> }
    ) => void;
  }
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") {
    return;
  }
  window.gtag?.("event", event.name, event.properties);
  window.plausible?.(event.name, { props: event.properties });
}
