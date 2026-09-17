"use client";

import { Text } from "@react-three/uikit";
import { VrWorked } from "@/components/ui/vr-worked";
import { useWorldTheme } from "@/components/ui/world-card";
import { VrDemoCanvas } from "./vr-demo-canvas";

function Demo() {
  const theme = useWorldTheme();
  return (
    <>
      <VrWorked duration={4}>
        <Text color={theme.subtle} fontSize={12}>
          cad_edit
        </Text>
      </VrWorked>
      <Text color={theme.text} fontSize={13}>
        Updated the hole to 8 mm.
      </Text>
    </>
  );
}

export default function VrWorkedDemoScene() {
  return (
    <VrDemoCanvas size={{ h: 180, w: 320 }}>
      <Demo />
    </VrDemoCanvas>
  );
}
