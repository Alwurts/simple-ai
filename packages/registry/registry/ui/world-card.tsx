"use client";

import {
  type ThreeElements,
  type ThreeEvent,
  useThree,
} from "@react-three/fiber";
import {
  createContext,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";

/** One millimetre per CSS pixel (uikit `pixelSize={0.001}`). */
export const PX = 0.001;

export type CardSize = { w: number; h: number };
export type WorldAppearance = "light" | "dark";
export type WorldPalette = {
  card: string;
  border: string;
  text: string;
  subtle: string;
  muted: string;
  hover: string;
  handleIdle: string;
  bubble: string;
  danger: string;
};

export const WORLD_PALETTE: Record<WorldAppearance, WorldPalette> = {
  light: {
    card: "#fafafa",
    border: "#e4e4e7",
    text: "#18181b",
    subtle: "#71717a",
    muted: "#f4f4f5",
    hover: "#e4e4e7",
    handleIdle: "#d4d4d8",
    bubble: "#e4e4e7",
    danger: "#dc2626",
  },
  dark: {
    card: "#27272a",
    border: "#3f3f46",
    text: "#fafafa",
    subtle: "#a1a1aa",
    muted: "#3f3f46",
    hover: "#52525b",
    handleIdle: "#3f3f46",
    bubble: "#3f3f46",
    danger: "#f87171",
  },
};

const ThemeContext = createContext<WorldPalette>(WORLD_PALETTE.dark);

export function WorldThemeProvider({
  appearance,
  children,
}: {
  appearance: WorldAppearance;
  children: ReactNode;
}) {
  return (
    <ThemeContext.Provider value={WORLD_PALETTE[appearance]}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useWorldTheme(): WorldPalette {
  return useContext(ThemeContext);
}

export function cardMeters(size: CardSize) {
  return { w: size.w * PX, h: size.h * PX };
}

export function clampSize(
  w: number,
  h: number,
  minW: number,
  minH: number,
  maxW: number,
  maxH: number
): CardSize {
  return {
    w: Math.round(Math.max(minW, Math.min(maxW, w))),
    h: Math.round(Math.max(minH, Math.min(maxH, h))),
  };
}

const lookPos = new THREE.Vector3();
const placePos = new THREE.Vector3();
const placeQuat = new THREE.Quaternion();
const placeForward = new THREE.Vector3();
const placeRight = new THREE.Vector3();

type Placeable = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

/** Yaw-only billboard on the floor plane. */
export function faceToward(obj: Placeable, camera: THREE.Camera) {
  camera.getWorldPosition(lookPos);
  obj.rotation.set(
    0,
    Math.atan2(lookPos.x - obj.position.x, lookPos.z - obj.position.z),
    0
  );
}

export function placeAtGaze(
  obj: Placeable,
  camera: THREE.Camera,
  {
    distance = 0.55,
    drop = 0.1,
    side = 0.22,
    face = true,
  }: {
    distance?: number;
    drop?: number;
    side?: number;
    face?: boolean;
  } = {}
) {
  camera.getWorldPosition(placePos);
  camera.getWorldQuaternion(placeQuat);
  placeForward.set(0, 0, -1).applyQuaternion(placeQuat);
  if (Math.abs(placeForward.y) > 0.999) {
    const sign = placeForward.y < 0 ? 1 : -1;
    placeForward.set(0, 1, 0).applyQuaternion(placeQuat).multiplyScalar(sign);
  }
  placeForward.y = 0;
  if (placeForward.lengthSq() < 1e-6) {
    placeForward.set(0, 0, -1);
  }
  placeForward.normalize();
  obj.position.copy(placePos).addScaledVector(placeForward, distance);
  obj.position.y = placePos.y - drop;
  if (side) {
    placeRight.set(1, 0, 0).applyQuaternion(placeQuat);
    placeRight.y = 0;
    if (placeRight.lengthSq() > 1e-6) {
      obj.position.addScaledVector(placeRight.normalize(), side);
    }
  }
  if (face) {
    faceToward(obj, camera);
  }
}

type Limits = { minW: number; minH: number; maxW: number; maxH: number };

type WorldCardValue = {
  size: CardSize;
  meters: { w: number; h: number };
  startMove: (ev: ThreeEvent<PointerEvent>) => void;
  dragMove: (ev: ThreeEvent<PointerEvent>) => void;
  endMove: (ev?: ThreeEvent<PointerEvent>) => void;
  setSize: (next: CardSize) => void;
};

const WorldCardContext = createContext<WorldCardValue | null>(null);

export function useWorldCard(): WorldCardValue {
  const ctx = useContext(WorldCardContext);
  if (!ctx) {
    throw new Error("useWorldCard must be used within <WorldCard>");
  }
  return ctx;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) {
    return;
  }
  if (typeof ref === "function") {
    ref(value);
  } else {
    ref.current = value;
  }
}

const tmpV = new THREE.Vector3();

export type WorldCardProps = ThreeElements["group"] & {
  size: CardSize;
  limits?: Limits;
  onSizeChange?: (next: CardSize) => void;
  shape?: "card" | "orb";
  radius?: number;
  resizable?: boolean;
  movable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export function WorldCard({
  ref,
  size,
  onSizeChange,
  limits = { minW: size.w, minH: size.h, maxW: size.w, maxH: size.h },
  shape = "card",
  radius = 0.04,
  resizable = true,
  movable = true,
  onDragStart,
  onDragEnd,
  children,
  ...props
}: WorldCardProps) {
  const inner = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const cameraRef = useRef(camera);
  cameraRef.current = camera;
  const drag = useRef<{ dist: number; offset: THREE.Vector3 } | null>(null);
  const meters = cardMeters(size);
  const onSizeRef = useRef(onSizeChange);
  onSizeRef.current = onSizeChange;
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const limitsRef = useRef(limits);
  limitsRef.current = limits;
  const theme = useWorldTheme();

  const onDragStartRef = useRef(onDragStart);
  onDragStartRef.current = onDragStart;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  const startMove = useCallback((ev: ThreeEvent<PointerEvent>) => {
    const a = inner.current;
    if (!a || drag.current) {
      return;
    }
    ev.stopPropagation();
    const cap = ev.target as {
      setPointerCapture?: (pid: number) => void;
    } | null;
    cap?.setPointerCapture?.(ev.pointerId);
    drag.current = {
      dist: ev.ray.origin.distanceTo(ev.point),
      offset: a.position.clone().sub(ev.point),
    };
    faceToward(a, cameraRef.current);
    onDragStartRef.current?.();
  }, []);

  const dragMove = useCallback((ev: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    const a = inner.current;
    if (!d || !a) {
      return;
    }
    ev.stopPropagation();
    tmpV.copy(ev.ray.direction).multiplyScalar(d.dist).add(ev.ray.origin);
    a.position.copy(tmpV).add(d.offset);
    faceToward(a, cameraRef.current);
  }, []);

  const endMove = useCallback((ev?: ThreeEvent<PointerEvent>) => {
    if (!drag.current) {
      return;
    }
    ev?.stopPropagation();
    const cap = ev?.target as {
      releasePointerCapture?: (id: number) => void;
    } | null;
    if (ev) {
      cap?.releasePointerCapture?.(ev.pointerId);
    }
    drag.current = null;
    onDragEndRef.current?.();
  }, []);

  const setSize = useCallback((next: CardSize) => {
    onSizeRef.current?.(next);
  }, []);

  const value = useMemo<WorldCardValue>(
    () => ({
      size,
      meters,
      startMove,
      dragMove,
      endMove,
      setSize,
    }),
    [size, meters, startMove, dragMove, endMove, setSize]
  );

  return (
    <WorldCardContext.Provider value={value}>
      <group
        name="world-card"
        ref={(node) => {
          inner.current = node;
          assignRef(ref as Ref<THREE.Group | null> | undefined, node);
        }}
        {...props}
      >
        {shape === "orb" ? (
          <OrbChrome
            radius={radius}
            color={theme.handleIdle}
            movable={movable}
          />
        ) : (
          <CardChrome
            meters={meters}
            size={size}
            limits={limits}
            resizable={resizable}
            movable={movable}
            hover={theme.hover}
            handle={theme.handleIdle}
          />
        )}
        {children}
      </group>
    </WorldCardContext.Provider>
  );
}

function OrbChrome({
  radius,
  color,
  movable,
}: {
  radius: number;
  color: string;
  movable: boolean;
}) {
  const { startMove, dragMove, endMove } = useWorldCard();
  if (!movable) {
    return null;
  }
  return (
    <mesh
      name="world-card-orb-ring"
      onPointerDown={startMove}
      onPointerMove={dragMove}
      onPointerUp={endMove}
      onPointerCancel={endMove}
    >
      <ringGeometry args={[radius + 0.006, radius + 0.012, 48]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CardChrome({
  meters,
  size,
  limits,
  resizable,
  movable,
  hover,
  handle,
}: {
  meters: { w: number; h: number };
  size: CardSize;
  limits: Limits;
  resizable: boolean;
  movable: boolean;
  hover: string;
  handle: string;
}) {
  const { startMove, dragMove, endMove, setSize } = useWorldCard();
  const hw = meters.w / 2;
  const hh = meters.h / 2;
  const resize = useRef<{
    sx: number;
    sy: number;
    startW: number;
    startH: number;
    localX: number;
    localY: number;
  } | null>(null);
  const local = useRef(new THREE.Vector3());
  const group = useRef<THREE.Group>(null);

  const onResizeDown =
    (sx: number, sy: number) => (ev: ThreeEvent<PointerEvent>) => {
      const parent = group.current?.parent;
      if (!parent) {
        return;
      }
      ev.stopPropagation();
      parent.worldToLocal(local.current.copy(ev.point));
      resize.current = {
        sx,
        sy,
        startW: size.w,
        startH: size.h,
        localX: local.current.x,
        localY: local.current.y,
      };
      const cap = ev.target as {
        setPointerCapture?: (pid: number) => void;
      } | null;
      cap?.setPointerCapture?.(ev.pointerId);
    };

  const onResizeMove = (ev: ThreeEvent<PointerEvent>) => {
    const d = resize.current;
    const parent = group.current?.parent;
    if (!d || !parent) {
      return;
    }
    ev.stopPropagation();
    parent.worldToLocal(local.current.copy(ev.point));
    setSize(
      clampSize(
        d.startW + (2 * d.sx * (local.current.x - d.localX)) / PX,
        d.startH + (2 * d.sy * (local.current.y - d.localY)) / PX,
        limits.minW,
        limits.minH,
        limits.maxW,
        limits.maxH
      )
    );
  };

  const onResizeUp = (ev: ThreeEvent<PointerEvent>) => {
    if (!resize.current) {
      return;
    }
    ev.stopPropagation();
    const cap = ev.target as {
      releasePointerCapture?: (id: number) => void;
    } | null;
    cap?.releasePointerCapture?.(ev.pointerId);
    resize.current = null;
  };

  const corners: { sx: number; sy: number }[] = [
    { sx: 1, sy: 1 },
    { sx: -1, sy: 1 },
    { sx: -1, sy: -1 },
    { sx: 1, sy: -1 },
  ];

  return (
    <group ref={group} name="world-card-chrome">
      {movable ? (
        <mesh
          position={[0, -hh - 0.016, 0.002]}
          onPointerDown={startMove}
          onPointerMove={dragMove}
          onPointerUp={endMove}
          onPointerCancel={endMove}
        >
          <planeGeometry args={[0.072, 0.01]} />
          <meshBasicMaterial color={handle} />
        </mesh>
      ) : null}
      {resizable
        ? corners.map((c) => (
            <mesh
              key={`${c.sx}:${c.sy}`}
              position={[c.sx * hw, c.sy * hh, 0.003]}
              onPointerDown={onResizeDown(c.sx, c.sy)}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeUp}
              onPointerCancel={onResizeUp}
            >
              <boxGeometry args={[0.012, 0.012, 0.004]} />
              <meshBasicMaterial color={hover} />
            </mesh>
          ))
        : null}
    </group>
  );
}
