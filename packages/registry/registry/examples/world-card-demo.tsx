"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";

const emptySubscribe = () => () => undefined;

const Demo = lazy(() => import("./world-card-demo-scene"));

export default function WorldCardPreview() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  if (!mounted) {
    return <div className="h-[480px] w-full bg-background" />;
  }
  return (
    <Suspense fallback={<div className="h-[480px] w-full bg-background" />}>
      <Demo />
    </Suspense>
  );
}
