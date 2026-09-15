export interface AnalyticsEvent {
  name: "copy_npm_command" | "copy_block_code";
  properties?: Record<string, string | number | boolean | null>;
}

declare global {
  interface Window {
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
  window.plausible?.(event.name, { props: event.properties });
}
