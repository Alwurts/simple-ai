"use client";

import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

/**
 * SPA pageviews after the first load. Plausible already records the
 * initial hit from the script in the document head.
 */
export function Analytics() {
  const href = useRouterState({ select: (s) => s.location.href });
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.plausible?.("pageview", { props: { path: href } });
  }, [href]);

  return null;
}
