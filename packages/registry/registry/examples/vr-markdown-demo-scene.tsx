"use client";

import { VrMarkdown } from "@/components/ui/vr-markdown";
import { VrDemoCanvas } from "./vr-demo-canvas";

const SAMPLE = `You are looking at a **VR** chat card.

- Drag the handle to move it
- Pinch a corner to resize
- Enter VR or AR to place it at your gaze

Use \`cad_edit\` for model changes.`;

export default function VrMarkdownDemoScene() {
  return (
    <VrDemoCanvas size={{ h: 240, w: 320 }}>
      <VrMarkdown markdown={SAMPLE} />
    </VrDemoCanvas>
  );
}
