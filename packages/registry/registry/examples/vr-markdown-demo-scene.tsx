"use client";

import { Container } from "@react-three/uikit";
import { VrMarkdown } from "@/components/ui/vr-markdown";
import { VrDemoCanvas } from "./vr-demo-canvas";

const SAMPLE = `## Hole edit

Updated the **8 mm** hole. Keep the _fillet_.

- Drag the handle to move
- Pinch a corner to resize

1. Measure the feature
2. Apply \`cad_edit\`
3. Rebuild

- [x] Hole diameter
- [ ] Chamfer

| Feature | Size |
| --- | --- |
| hole | 8 mm |
| fillet | 1 mm |

> Enter VR to place the card at your gaze.

\`\`\`
cad_edit({ diameter_mm: 8 })
\`\`\`
`;

export default function VrMarkdownDemoScene() {
  return (
    <VrDemoCanvas size={{ h: 340, w: 340 }}>
      <Container flexGrow={1} minHeight={0} overflow="scroll" width="100%">
        <VrMarkdown markdown={SAMPLE} />
      </Container>
    </VrDemoCanvas>
  );
}
