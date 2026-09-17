"use client";

import { VrReasoning } from "@/components/ui/vr-reasoning";
import { VrDemoCanvas } from "./vr-demo-canvas";

export default function VrReasoningDemoScene() {
  return (
    <VrDemoCanvas size={{ h: 180, w: 320 }}>
      <VrReasoning text="The wearer is in a VR session. I will describe the card in the scene, not a 2D page." />
    </VrDemoCanvas>
  );
}
