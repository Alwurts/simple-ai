"use client";

import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

/**
 * SPA pageviews after the first load. gtag + Plausible already record the
 * initial hit from their scripts in the document head.
 */
export function Analytics() {
  const href = useRouterState({ select: (s) => s.location.href });
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.gtag?.("event", "page_view", { page_location: href });
    window.plausible?.("pageview");
  }, [href]);

  return null;
}
