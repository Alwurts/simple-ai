"use client";

import { Canvas } from "@react-three/fiber";
import { Container } from "@react-three/uikit";
import { type ReactNode, useState } from "react";
import {
  type CardSize,
  WorldCard,
  WorldThemeProvider,
} from "@/components/ui/world-card";

export function XrDemoCanvas({
  children,
  size: initial = { w: 320, h: 200 },
}: {
  children: ReactNode;
  size?: CardSize;
}) {
  const [size, setSize] = useState<CardSize>(initial);
  const dark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <div className="h-[480px] w-full">
      <Canvas camera={{ position: [0, 0, 0.55], fov: 42 }}>
        <color attach="background" args={[dark ? "#18181b" : "#f4f4f5"]} />
        <ambientLight intensity={0.8} />
        <WorldThemeProvider appearance={dark ? "dark" : "light"}>
          <WorldCard
            limits={{ maxH: 360, maxW: 480, minH: 80, minW: 160 }}
            onSizeChange={setSize}
            size={size}
          >
            <Container
              flexDirection="column"
              gap={8}
              height={size.h}
              padding={12}
              pixelSize={0.001}
              pointerEvents="auto"
              width={size.w}
            >
              {children}
            </Container>
          </WorldCard>
        </WorldThemeProvider>
      </Canvas>
    </div>
  );
}
