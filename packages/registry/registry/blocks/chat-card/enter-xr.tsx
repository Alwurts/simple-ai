"use client";

import { useEffect, useState } from "react";
import { enterAR, enterVR } from "./xr-store";

type XrSupport = { ar: boolean; vr: boolean };

export function EnterXr() {
  const [support, setSupport] = useState<XrSupport | null>(null);

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

  if (!(support?.ar || support?.vr)) {
    return null;
  }

  return (
    <div className="pointer-events-auto absolute right-4 bottom-4 z-10 flex gap-2 rounded-xl border border-border bg-card/95 p-1 shadow-lg">
      {support.vr ? (
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
      {support.ar ? (
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
