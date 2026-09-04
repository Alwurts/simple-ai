"use client";

import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

function isPreviewFrame(pathname: string) {
  return pathname === "/view" || pathname.startsWith("/view/");
}

export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isFirst = useRef(true);

  useEffect(() => {
    if (isPreviewFrame(pathname)) {
      return;
    }
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.plausible?.("pageview");
  }, [pathname]);

  if (isPreviewFrame(pathname)) {
    return null;
  }

  return (
    <script
      data-domain="simple-ai.dev"
      defer
      src="https://plausible.alwurts.com/js/script.js"
    />
  );
}
