"use client";

import { Canvas } from "@react-three/fiber";
import { Container } from "@react-three/uikit";
import { type ReactNode, useState } from "react";
import {
  type CardSize,
  useWorldTheme,
  WorldCard,
  WorldThemeProvider,
} from "@/components/ui/world-card";

function Studio({ dark, floorY }: { dark: boolean; floorY: number }) {
  const floor = dark ? "#1a1d21" : "#eeeff1";
  const major = dark ? 0x4b5158 : 0xc9cdd3;
  const minor = dark ? 0x2c3036 : 0xe2e4e8;
  return (
    <>
      <color attach="background" args={[floor]} />
      <mesh position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color={floor} />
      </mesh>
      <gridHelper
        args={[3, 16, major, minor]}
        position={[0, floorY + 0.001, 0]}
      />
    </>
  );
}

function CardBody({ children, size }: { children: ReactNode; size: CardSize }) {
  const theme = useWorldTheme();
  return (
    <Container
      backgroundColor={theme.card}
      borderRadius={12}
      flexDirection="column"
      gap={8}
      height={size.h}
      overflow="hidden"
      padding={12}
      pixelSize={0.001}
      pointerEvents="auto"
      width={size.w}
    >
      {children}
    </Container>
  );
}

export function VrDemoCanvas({
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
  const floorY = -(initial.h * 0.001) / 2 - 0.04;

  return (
    <div className="h-[450px] w-full">
      <Canvas camera={{ fov: 42, position: [0, 0.1, 0.52] }}>
        <Studio dark={dark} floorY={floorY} />
        <hemisphereLight args={[0xffffff, 0xb8bcc2, 0.95]} />
        <directionalLight intensity={1.1} position={[0.4, 0.6, 0.5]} />
        <WorldThemeProvider appearance={dark ? "dark" : "light"}>
          <WorldCard
            limits={{ maxH: 360, maxW: 480, minH: 80, minW: 160 }}
            onSizeChange={setSize}
            size={size}
          >
            <CardBody size={size}>{children}</CardBody>
          </WorldCard>
        </WorldThemeProvider>
      </Canvas>
    </div>
  );
}
