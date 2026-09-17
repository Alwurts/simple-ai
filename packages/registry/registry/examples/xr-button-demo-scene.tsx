"use client";

import { Text } from "@react-three/uikit";
import { useState } from "react";
import { useWorldTheme } from "@/components/ui/world-card";
import { XrButton } from "@/components/ui/xr-button";
import { XrDemoCanvas } from "./xr-demo-canvas";

function Demo() {
  const theme = useWorldTheme();
  const [count, setCount] = useState(0);
  return (
    <>
      <Text color={theme.text} fontSize={14}>
        Presses: {count}
      </Text>
      <XrButton label="Press" onClick={() => setCount((value) => value + 1)} />
      <XrButton disabled label="Needs a headset" />
    </>
  );
}

export default function XrButtonDemoScene() {
  return (
    <XrDemoCanvas size={{ h: 160, w: 240 }}>
      <Demo />
    </XrDemoCanvas>
  );
}
