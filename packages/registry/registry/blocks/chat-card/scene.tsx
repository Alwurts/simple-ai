"use client";

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
import { ExperienceHud } from "./hud";
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
const DESKTOP_POS: [number, number, number] = [0, 1.52, -0.35];

function appearanceFromDom(): "light" | "dark" {
  if (typeof document === "undefined") {
    return "dark";
  }
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function Studio({ appearance }: { appearance: "light" | "dark" }) {
  const major = appearance === "dark" ? 0x4b5158 : 0xc9cdd3;
  const minor = appearance === "dark" ? 0x2c3036 : 0xe2e4e8;
  const floor = appearance === "dark" ? "#1a1d21" : "#eeeff1";
  return (
    <>
      <color attach="background" args={[floor]} />
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={floor} />
      </mesh>
      <gridHelper args={[8, 32, major, minor]} />
    </>
  );
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
  const placedSession = useRef(false);
  const placedDesktop = useRef(false);

  const bringHere = useCallback(() => {
    const a = anchor.current;
    if (!a) {
      return;
    }
    placeAtGaze(a, camera, {
      distance: 0.55,
      drop: 0.25,
      side: 0.18,
      face: true,
    });
    placedSession.current = true;
  }, [camera]);

  useFrame((_, dt) => {
    const a = anchor.current;
    if (!a) {
      return;
    }
    if (session) {
      placedDesktop.current = false;
      if (!placedSession.current) {
        bringHere();
      }
    } else if (!placedDesktop.current) {
      a.position.set(...DESKTOP_POS);
      a.rotation.set(0, 0, 0);
      placedDesktop.current = true;
      placedSession.current = false;
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
      handle={open}
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

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <ExperienceHud />
      <Canvas
        camera={{
          fov: 70,
          near: 0.01,
          far: 50,
          position: [0, 1.6, 0.15],
          rotation: [0, 0, 0],
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0, touchAction: "none" }}
      >
        <XR store={xrStore}>
          <hemisphereLight args={[0xffffff, 0xb8bcc2, 0.95]} />
          <directionalLight intensity={1.35} position={[0.55, 1.6, 0.45]} />
          <WorldThemeProvider appearance={appearance}>
            <IfInSessionMode deny="immersive-ar">
              <Studio appearance={appearance} />
            </IfInSessionMode>
            <ChatDock />
          </WorldThemeProvider>
        </XR>
      </Canvas>
    </div>
  );
}
