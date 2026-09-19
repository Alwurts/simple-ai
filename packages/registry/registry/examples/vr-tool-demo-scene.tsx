"use client";

import { VrTool } from "@/components/ui/vr-tool";
import { VrDemoCanvas } from "./vr-demo-canvas";

export default function VrToolDemoScene() {
  return (
    <VrDemoCanvas size={{ h: 180, w: 320 }}>
      <VrTool
        defaultOpen
        input={{ diameter_mm: 8, feature: "hole" }}
        output={{ diameter_mm: 8, ok: true }}
        toolName="cad_edit"
      />
    </VrDemoCanvas>
  );
}
