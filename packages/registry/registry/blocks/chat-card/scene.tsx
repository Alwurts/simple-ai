"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { IfInSessionMode, useXR, XR } from "@react-three/xr";
import { useCallback, useRef, useState } from "react";
import type { Group } from "three";
import {
  type CardSize,
  cardMeters,
  placeAtGaze,
  WorldCard,
  WorldThemeProvider,
} from "@/components/ui/world-card";
import { ChatCardBody } from "./chat-body";
import { EnterXr } from "./enter-xr";
import { ORB_RADIUS, SpeakingOrb } from "./speaking-orb";
import { xrStore } from "./xr-store";

const CHAT_CARD = {
  w: 340,
  h: 520,
  minW: 280,
  minH: 400,
  maxW: 800,
  maxH: 720,
};
const ORB_LIFT = 0.08;

function appearanceFromDom(): "light" | "dark" {
  if (typeof document === "undefined") {
    return "dark";
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function ChatDock() {
  const session = useXR((s) => s.session);
  const camera = useThree((s) => s.camera);
  const [open, setOpen] = useState(true);
  const [size, setSize] = useState<CardSize>({
    w: CHAT_CARD.w,
    h: CHAT_CARD.h,
  });
  const meters = cardMeters(size);
  const orbTop = meters.h / 2 + ORB_LIFT;
  const orbLift = useRef(0);
  const orbSlot = useRef<Group>(null);
  const dragging = useRef(false);
  const anchor = useRef<Group>(null);
  const placed = useRef(false);

  const bringHere = useCallback(() => {
    const a = anchor.current;
    if (!a) {
      return;
    }
    placeAtGaze(a, camera, {
      distance: 0.55,
      drop: 0.1,
      side: 0.22,
      face: true,
    });
    placed.current = true;
  }, [camera]);

  useFrame((_, dt) => {
    const a = anchor.current;
    if (!a) {
      return;
    }
    if (session && !placed.current) {
      bringHere();
    }
    if (!session) {
      placed.current = false;
      a.position.set(0, 0, 0);
      a.rotation.set(0, 0, 0);
    }
    const orbGoal = open ? orbTop : 0;
    orbLift.current += (orbGoal - orbLift.current) * Math.min(1, 10 * dt);
    if (orbSlot.current) {
      orbSlot.current.position.y = orbLift.current;
    }
  });

  const toggleCard = () => {
    if (dragging.current) {
      return;
    }
    setOpen((value) => !value);
  };

  return (
    <WorldCard
      ref={anchor}
      limits={CHAT_CARD}
      movable
      onDragEnd={() => {
        dragging.current = false;
      }}
      onDragStart={() => {
        dragging.current = true;
      }}
      onSizeChange={setSize}
      radius={ORB_RADIUS}
      resizable={open}
      shape={open ? "card" : "orb"}
      size={size}
    >
      <group ref={orbSlot}>
        <SpeakingOrb onClick={toggleCard} />
      </group>
      {open ? <ChatCardBody height={size.h} width={size.w} /> : null}
    </WorldCard>
  );
}

export default function ChatCardScene() {
  const appearance = appearanceFromDom();
  const studio = appearance === "dark" ? "#1a1d21" : "#eeeff1";

  return (
    <div className="relative h-dvh w-full bg-background">
      <EnterXr />
      <Canvas
        camera={{ position: [0, 0, 0.85], fov: 50, near: 0.01, far: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <XR store={xrStore}>
          <color attach="background" args={[studio]} />
          <hemisphereLight args={[0xffffff, 0xb8bcc2, 0.95]} />
          <directionalLight intensity={1.35} position={[0.55, 1.1, 0.45]} />
          <WorldThemeProvider appearance={appearance}>
            <ChatDock />
          </WorldThemeProvider>
          <IfInSessionMode deny={["immersive-ar", "immersive-vr"]}>
            <OrbitControls enableDamping makeDefault />
          </IfInSessionMode>
        </XR>
      </Canvas>
    </div>
  );
}
