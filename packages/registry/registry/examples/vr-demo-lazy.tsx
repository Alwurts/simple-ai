"use client";

import {
  type ComponentType,
  lazy,
  Suspense,
  useSyncExternalStore,
} from "react";

const emptySubscribe = () => () => undefined;

export function vrDemo(load: () => Promise<{ default: ComponentType }>) {
  const Demo = lazy(load);
  return function VrDemoPreview() {
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
  };
}
