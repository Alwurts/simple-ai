"use client";

import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import {
  type CardSize,
  WorldCard,
  WorldThemeProvider,
} from "@/components/ui/world-card";

export default function WorldCardDemoScene() {
  const [size, setSize] = useState<CardSize>({ w: 240, h: 160 });
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
            size={size}
            onSizeChange={setSize}
            limits={{ minW: 160, minH: 120, maxW: 360, maxH: 240 }}
          >
            <mesh>
              <planeGeometry args={[size.w * 0.001, size.h * 0.001]} />
              <meshStandardMaterial color={dark ? "#27272a" : "#fafafa"} />
            </mesh>
          </WorldCard>
        </WorldThemeProvider>
      </Canvas>
    </div>
  );
}
