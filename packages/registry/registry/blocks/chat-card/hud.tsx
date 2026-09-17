"use client";

import { useEffect, useState } from "react";
import { enterAR, enterVR } from "./xr-store";

type XrSupport = { ar: boolean; vr: boolean; ready: boolean };

function SessionButton({
  enabled,
  label,
  onEnter,
}: {
  enabled: boolean;
  label: string;
  onEnter: () => void;
}) {
  return (
    <button
      className="h-9 rounded-lg px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      disabled={!enabled}
      onClick={() => {
        if (enabled) {
          onEnter();
        }
      }}
      title={enabled ? label : "Needs a headset (Quest Browser)"}
      type="button"
    >
      {label}
    </button>
  );
}

export function ExperienceHud({ onLookAround }: { onLookAround: () => void }) {
  const [support, setSupport] = useState<XrSupport>({
    ar: false,
    vr: false,
    ready: false,
  });
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const xr = navigator.xr;
    if (!xr) {
      setSupport({ ar: false, vr: false, ready: true });
      return;
    }
    let cancelled = false;
    Promise.all([
      xr.isSessionSupported("immersive-ar").catch(() => false),
      xr.isSessionSupported("immersive-vr").catch(() => false),
    ]).then(([ar, vr]) => {
      if (!cancelled) {
        setSupport({ ar, vr, ready: true });
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

  const xrReady = support.ready && (support.ar || support.vr);

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
          {support.ready && !xrReady
            ? " Enter VR/AR needs a headset (Quest Browser)."
            : null}
        </p>
        <div className="flex flex-wrap justify-end gap-1 rounded-xl border border-border bg-card/95 p-1 shadow-lg">
          <button
            className="h-9 rounded-lg px-3 text-sm"
            onClick={onLookAround}
            type="button"
          >
            Look around
          </button>
          <SessionButton
            enabled={support.vr}
            label="Enter VR"
            onEnter={() => {
              enterVR();
            }}
          />
          <SessionButton
            enabled={support.ar}
            label="Enter AR"
            onEnter={() => {
              enterAR();
            }}
          />
        </div>
      </div>
    </>
  );
}
