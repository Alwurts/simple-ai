"use client";

import { XrMarkdown } from "@/components/ui/xr-markdown";
import { XrDemoCanvas } from "./xr-demo-canvas";

const SAMPLE = `You are looking at an **in-world** chat card.

- Drag the handle to move it
- Pinch a corner to resize
- Enter VR or AR to place it at your gaze

Use \`cad_edit\` for model changes.`;

export default function XrMarkdownDemoScene() {
  return (
    <XrDemoCanvas size={{ h: 240, w: 320 }}>
      <XrMarkdown markdown={SAMPLE} />
    </XrDemoCanvas>
  );
}
