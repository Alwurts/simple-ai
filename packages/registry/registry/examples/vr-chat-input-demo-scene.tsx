"use client";

import { Text } from "@react-three/uikit";
import { useState } from "react";
import { VrChatInput } from "@/components/ui/vr-chat-input";
import { asciiSafe } from "@/components/ui/vr-markdown";
import { useWorldTheme } from "@/components/ui/world-card";
import { VrDemoCanvas } from "./vr-demo-canvas";

function Demo() {
  const theme = useWorldTheme();
  const [last, setLast] = useState("Type and send.");
  return (
    <>
      <Text color={theme.text} fontSize={13}>
        {asciiSafe(last)}
      </Text>
      <VrChatInput onSubmit={setLast} placeholder="Ask in world space" />
    </>
  );
}

export default function VrChatInputDemoScene() {
  return (
    <VrDemoCanvas size={{ h: 140, w: 320 }}>
      <Demo />
    </VrDemoCanvas>
  );
}
