"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";

const emptySubscribe = () => () => undefined;

const Scene = lazy(() => import("./scene"));

/** Wire a route to this file after install. WebGL loads only in the browser. */
export default function ChatCardPage() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  if (!mounted) {
    return <div className="h-dvh w-full bg-background" />;
  }
  return (
    <Suspense fallback={<div className="h-dvh w-full bg-background" />}>
      <Scene />
    </Suspense>
  );
}
