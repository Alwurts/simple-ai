"use client";

import { useSyncExternalStore } from "react";
import { enterAR, enterVR } from "./xr-store";

const emptySubscribe = () => () => undefined;

function useXrSupport() {
  return useSyncExternalStore(
    (onStoreChange) => {
      let cancelled = false;
      const tick = () => {
        const xr = navigator.xr;
        if (!xr) {
          onStoreChange();
          return;
        }
        Promise.all([
          xr.isSessionSupported("immersive-ar").catch(() => false),
          xr.isSessionSupported("immersive-vr").catch(() => false),
        ]).then(() => {
          if (!cancelled) {
            onStoreChange();
          }
        });
      };
      tick();
      return () => {
        cancelled = true;
      };
    },
    () => {
      const xr = navigator.xr;
      return {
        ready: true,
        ar: Boolean(xr),
        vr: Boolean(xr),
      };
    },
    () => ({ ready: false, ar: false, vr: false })
  );
}

export function EnterXr() {
  const { ar, vr, ready } = useXrSupport();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  if (!(mounted && ready && (ar || vr))) {
    return null;
  }
  return (
    <div className="pointer-events-auto absolute right-4 bottom-4 z-10 flex gap-2 rounded-xl border border-border bg-card/95 p-1 shadow-lg">
      {vr ? (
        <button
          className="h-9 rounded-lg px-3 text-sm"
          onClick={() => {
            enterVR();
          }}
          type="button"
        >
          Enter VR
        </button>
      ) : null}
      {ar ? (
        <button
          className="h-9 rounded-lg px-3 text-sm"
          onClick={() => {
            enterAR();
          }}
          type="button"
        >
          Enter AR
        </button>
      ) : null}
    </div>
  );
}
