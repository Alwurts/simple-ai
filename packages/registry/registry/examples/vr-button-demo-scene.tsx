"use client";

import { Text } from "@react-three/uikit";
import { useState } from "react";
import { VrButton } from "@/components/ui/vr-button";
import { useWorldTheme } from "@/components/ui/world-card";
import { VrDemoCanvas } from "./vr-demo-canvas";

function Demo() {
  const theme = useWorldTheme();
  const [count, setCount] = useState(0);
  return (
    <>
      <Text color={theme.text} fontSize={14}>
        Presses: {count}
      </Text>
      <VrButton label="Press" onClick={() => setCount((value) => value + 1)} />
      <VrButton disabled label="Needs a headset" />
    </>
  );
}

export default function VrButtonDemoScene() {
  return (
    <VrDemoCanvas size={{ h: 160, w: 240 }}>
      <Demo />
    </VrDemoCanvas>
  );
}
