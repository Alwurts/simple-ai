"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import { useWorldTheme } from "@/components/ui/world-card";

export const ORB_RADIUS = 0.04;

export function SpeakingOrb({
  onClick,
  speaking = false,
}: {
  onClick: () => void;
  speaking?: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const theme = useWorldTheme();

  useFrame((state) => {
    const m = mesh.current;
    if (!m) {
      return;
    }
    const t = state.clock.elapsedTime;
    const s = speaking
      ? 1 + Math.sin(t * 8) * 0.08
      : 1 + Math.sin(t * 2.2) * 0.04;
    m.scale.setScalar(s);
  });

  return (
    <mesh ref={mesh} name="speaking-orb" onClick={onClick}>
      <icosahedronGeometry args={[ORB_RADIUS, 2]} />
      <meshStandardMaterial
        color={theme.card}
        emissive={theme.hover}
        emissiveIntensity={0.45}
        metalness={0.2}
        roughness={0.35}
      />
    </mesh>
  );
}
