"use client";

import { XrReasoning } from "@/components/ui/xr-reasoning";
import { XrDemoCanvas } from "./xr-demo-canvas";

export default function XrReasoningDemoScene() {
  return (
    <XrDemoCanvas size={{ h: 180, w: 320 }}>
      <XrReasoning text="The wearer is in a WebXR session. I will describe the in-world card, not a 2D page." />
    </XrDemoCanvas>
  );
}
