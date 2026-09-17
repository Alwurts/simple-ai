"use client";

import { XrTool } from "@/components/ui/xr-tool";
import { XrDemoCanvas } from "./xr-demo-canvas";

export default function XrToolDemoScene() {
  return (
    <XrDemoCanvas size={{ h: 180, w: 320 }}>
      <XrTool
        defaultOpen
        input={{ diameter_mm: 8, feature: "hole" }}
        output={{ diameter_mm: 8, ok: true }}
        toolName="cad_edit"
      />
    </XrDemoCanvas>
  );
}
