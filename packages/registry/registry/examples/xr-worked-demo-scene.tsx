"use client";

import { Text } from "@react-three/uikit";
import { useWorldTheme } from "@/components/ui/world-card";
import { XrWorked } from "@/components/ui/xr-worked";
import { XrDemoCanvas } from "./xr-demo-canvas";

function Demo() {
  const theme = useWorldTheme();
  return (
    <>
      <XrWorked duration={4}>
        <Text color={theme.subtle} fontSize={12}>
          cad_edit
        </Text>
      </XrWorked>
      <Text color={theme.text} fontSize={13}>
        Updated the hole to 8 mm.
      </Text>
    </>
  );
}

export default function XrWorkedDemoScene() {
  return (
    <XrDemoCanvas size={{ h: 180, w: 320 }}>
      <Demo />
    </XrDemoCanvas>
  );
}
