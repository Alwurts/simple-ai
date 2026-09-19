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

export function ExperienceHud() {
  const [support, setSupport] = useState<XrSupport>({
    ar: false,
    vr: false,
    ready: false,
  });

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

  const xrReady = support.ready && (support.ar || support.vr);

  return (
    <div className="pointer-events-auto absolute top-4 right-4 z-10 flex max-w-[min(100%-2rem,28rem)] flex-col items-end gap-2">
      <p className="rounded-lg border border-border bg-card/95 px-3 py-2 text-muted-foreground text-xs shadow-lg">
        Drag the handle to move. Corners and edges resize.
        {support.ready && !xrReady
          ? " Enter VR/AR needs a headset (Quest Browser)."
          : null}
      </p>
      <div className="flex flex-wrap justify-end gap-1 rounded-xl border border-border bg-card/95 p-1 shadow-lg">
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
  );
}
