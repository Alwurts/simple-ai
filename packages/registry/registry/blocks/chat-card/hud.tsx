"use client";

import { useEffect, useState } from "react";
import { enterAR, enterVR } from "./xr-store";

type XrSupport = { ar: boolean; vr: boolean };

export function ExperienceHud({ onLookAround }: { onLookAround: () => void }) {
  const [support, setSupport] = useState<XrSupport | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const xr = navigator.xr;
    if (!xr) {
      setSupport({ ar: false, vr: false });
      return;
    }
    let cancelled = false;
    Promise.all([
      xr.isSessionSupported("immersive-ar").catch(() => false),
      xr.isSessionSupported("immersive-vr").catch(() => false),
    ]).then(([ar, vr]) => {
      if (!cancelled) {
        setSupport({ ar, vr });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onChange = () => {
      setLocked(document.pointerLockElement !== null);
    };
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, []);

  return (
    <>
      {locked ? (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <div className="size-1.5 rounded-full bg-white/90 shadow" />
        </div>
      ) : null}
      <div className="pointer-events-auto absolute right-4 bottom-4 z-10 flex max-w-[min(100%-2rem,28rem)] flex-col items-end gap-2">
        <p className="rounded-lg border border-border bg-card/95 px-3 py-2 text-muted-foreground text-xs shadow-lg">
          First-person studio. Left click uses the card. Right-drag looks
          around. WASD walks. Wheel stays in the scene.
        </p>
        <div className="flex flex-wrap justify-end gap-1 rounded-xl border border-border bg-card/95 p-1 shadow-lg">
          <button
            className="h-9 rounded-lg px-3 text-sm"
            onClick={onLookAround}
            type="button"
          >
            Look around
          </button>
          {support?.vr ? (
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
          {support?.ar ? (
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
      </div>
    </>
  );
}
