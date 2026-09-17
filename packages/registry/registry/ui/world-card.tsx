"use client";

import {
  type ThreeElements,
  type ThreeEvent,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  createContext,
  type ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import {
  bandWidth,
  CARD_R,
  type CardSize,
  CORNER_LAYOUT,
  type CornerId,
  cardMeters,
  clampSize,
  classify,
  cornerStrokeGeometry,
  EDGE_LAYOUT,
  type EdgeId,
  GAP,
  HANDLE_DROP,
  HANDLE_EXP_LEN,
  HANDLE_EXP_R,
  HANDLE_LEN,
  HANDLE_R,
  HIT_PAD,
  handleCenterY,
  NEAR_PAD,
  PX,
  type Region,
  rayOnCard,
  registerCard,
  roundedRectGeometry,
  STROKE,
  stadiumGeometry,
  visibleRaycast,
} from "./world-card-chrome";

export {
  cardMeters,
  clampSize,
  hitChrome,
  nearestCard,
  PX,
  registerCard,
} from "./world-card-chrome";
export type { CardSize, Region };

export type WorldAppearance = "light" | "dark";
export type WorldPalette = {
  card: string;
  border: string;
  text: string;
  subtle: string;
  muted: string;
  hover: string;
  pressed: string;
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
    pressed: "#bfdbfe",
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
    pressed: "#1e40af",
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
  anchor: RefObject<THREE.Group | null>;
  size: CardSize;
  meters: { w: number; h: number };
  limits: Limits;
  startMove: (ev: ThreeEvent<PointerEvent>) => void;
  dragMove: (ev: ThreeEvent<PointerEvent>) => void;
  startMoveAt: (world: THREE.Vector3) => void;
  moveTo: (world: THREE.Vector3) => void;
  endMove: (ev?: ThreeEvent<PointerEvent>) => void;
  setSize: (next: CardSize) => void;
  setDragging: (active: boolean) => void;
  notifyDragStart: (region: Region) => void;
  notifyDragEnd: (region: Region) => void;
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
  handle?: boolean;
  onDragStart?: (region?: Region) => void;
  onDragEnd?: (region?: Region) => void;
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
  handle,
  onDragStart,
  onDragEnd,
  children,
  ...props
}: WorldCardProps) {
  const inner = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const cameraRef = useRef(camera);
  cameraRef.current = camera;
  const drag = useRef<{
    kind: "ray" | "near";
    dist: number;
    offset: THREE.Vector3;
  } | null>(null);
  const meters = cardMeters(size);
  const onSizeRef = useRef(onSizeChange);
  onSizeRef.current = onSizeChange;
  const onDragStartRef = useRef(onDragStart);
  onDragStartRef.current = onDragStart;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;
  const dragging = useRef(false);

  const setDragging = useCallback((active: boolean) => {
    dragging.current = active;
  }, []);
  const notifyDragStart = useCallback((region: Region) => {
    onDragStartRef.current?.(region);
  }, []);
  const notifyDragEnd = useCallback((region: Region) => {
    onDragEndRef.current?.(region);
  }, []);

  const startMoveAt = useCallback(
    (world: THREE.Vector3, kind: "ray" | "near" = "near", dist = 0) => {
      const a = inner.current;
      if (!a || drag.current) {
        return;
      }
      drag.current = { kind, dist, offset: a.position.clone().sub(world) };
      faceToward(a, cameraRef.current);
      setDragging(true);
    },
    [setDragging]
  );
  const moveTo = useCallback((world: THREE.Vector3) => {
    const d = drag.current;
    const a = inner.current;
    if (!d || !a) {
      return;
    }
    a.position.copy(world).add(d.offset);
    faceToward(a, cameraRef.current);
  }, []);
  const startMove = useCallback(
    (ev: ThreeEvent<PointerEvent>) => {
      const a = inner.current;
      if (!a || drag.current) {
        return;
      }
      ev.stopPropagation();
      const cap = ev.target as {
        setPointerCapture?: (pid: number) => void;
      } | null;
      cap?.setPointerCapture?.(ev.pointerId);
      startMoveAt(ev.point, "ray", ev.ray.origin.distanceTo(ev.point));
    },
    [startMoveAt]
  );
  const dragMove = useCallback(
    (ev: ThreeEvent<PointerEvent>) => {
      const d = drag.current;
      if (!d || d.kind !== "ray") {
        return;
      }
      ev.stopPropagation();
      tmpV.copy(ev.ray.direction).multiplyScalar(d.dist).add(ev.ray.origin);
      moveTo(tmpV);
    },
    [moveTo]
  );
  const endMove = useCallback(
    (ev?: ThreeEvent<PointerEvent>) => {
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
      setDragging(false);
    },
    [setDragging]
  );
  const setSize = useCallback((next: CardSize) => {
    onSizeRef.current?.(next);
  }, []);

  const value: WorldCardValue = {
    anchor: inner,
    size,
    meters,
    limits,
    startMove,
    dragMove,
    startMoveAt: (world: THREE.Vector3) => startMoveAt(world, "near"),
    moveTo,
    endMove,
    setSize,
    setDragging,
    notifyDragStart,
    notifyDragEnd,
  };

  const showHandle = handle ?? movable;
  const showChrome = shape === "orb" || resizable || movable || showHandle;

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
        {showChrome ? (
          <CardChrome
            corners={resizable}
            edges={movable ? ["t", "l", "r"] : []}
            handle={showHandle}
            radius={radius}
            shape={shape}
          />
        ) : null}
        {children}
      </group>
    </WorldCardContext.Provider>
  );
}

const CORNER_STROKE = cornerStrokeGeometry();
const HANDLE_GEOM = stadiumGeometry(HANDLE_LEN, HANDLE_R);
const HANDLE_EXP_GEOM = stadiumGeometry(HANDLE_EXP_LEN, HANDLE_EXP_R);

const CORNER_SIGN: Record<CornerId, { sx: number; sy: number }> = {
  tr: { sx: 1, sy: 1 },
  tl: { sx: -1, sy: 1 },
  bl: { sx: -1, sy: -1 },
  br: { sx: 1, sy: -1 },
};

type Drag =
  | {
      kind: "resize";
      region: Region;
      corner: CornerId;
      sx: number;
      sy: number;
      startW: number;
      startH: number;
      localX: number;
      localY: number;
    }
  | { kind: "move"; region: Region };

function CardChrome({
  shape = "card",
  radius = 0,
  corners = true,
  edges = ["t", "l", "r"],
  handle = false,
}: {
  shape?: "card" | "orb";
  radius?: number;
  corners?: boolean;
  edges?: readonly EdgeId[];
  handle?: boolean;
}) {
  const {
    anchor,
    size,
    limits,
    setSize,
    setDragging,
    startMove,
    dragMove,
    startMoveAt,
    moveTo,
    endMove,
    notifyDragStart,
    notifyDragEnd,
  } = useWorldCard();
  const theme = useWorldTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;
  const meters = cardMeters(size);
  const hw = meters.w / 2;
  const hh = meters.h / 2;
  const outer = bandWidth(HIT_PAD);
  const opts = { shape, radius, corners, edges, handle };

  const sizeRef = useRef(size);
  sizeRef.current = size;
  const limitsRef = useRef(limits);
  limitsRef.current = limits;
  const setSizeRef = useRef(setSize);
  setSizeRef.current = setSize;
  const setDraggingRef = useRef(setDragging);
  setDraggingRef.current = setDragging;
  const startMoveRef = useRef(startMove);
  startMoveRef.current = startMove;
  const dragMoveRef = useRef(dragMove);
  dragMoveRef.current = dragMove;
  const startMoveAtRef = useRef(startMoveAt);
  startMoveAtRef.current = startMoveAt;
  const moveToRef = useRef(moveTo);
  moveToRef.current = moveTo;
  const endMoveRef = useRef(endMove);
  endMoveRef.current = endMove;
  const notifyStartRef = useRef(notifyDragStart);
  notifyStartRef.current = notifyDragStart;
  const notifyEndRef = useRef(notifyDragEnd);
  notifyEndRef.current = notifyDragEnd;
  const localScratch = useRef(new THREE.Vector3());
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const drag = useRef<Drag | null>(null);
  const hover = useRef<Region>("none");
  const strokes = useRef(new Map<Region, THREE.Mesh>());
  const expandT = useRef(0);
  const idleVis = useRef<THREE.Mesh>(null);
  const expVis = useRef<THREE.Group>(null);
  const collapse = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleOpen = useRef(false);

  const keepOpen = () => {
    if (collapse.current) {
      clearTimeout(collapse.current);
    }
    collapse.current = null;
    handleOpen.current = true;
  };
  const maybeClose = () => {
    if (drag.current?.region === "handle") {
      return;
    }
    if (collapse.current) {
      clearTimeout(collapse.current);
    }
    collapse.current = setTimeout(() => {
      handleOpen.current = false;
    }, 120);
  };

  const beginResizeAt = (corner: CornerId, localX: number, localY: number) => {
    if (drag.current) {
      return;
    }
    const { sx, sy } = CORNER_SIGN[corner];
    const s = sizeRef.current;
    drag.current = {
      kind: "resize",
      region: `corner:${corner}`,
      corner,
      sx,
      sy,
      startW: s.w,
      startH: s.h,
      localX,
      localY,
    };
    setDraggingRef.current(true);
    show(`corner:${corner}`, true, true);
    notifyStartRef.current(`corner:${corner}`);
  };

  const resizeToLocal = (localX: number, localY: number) => {
    const d = drag.current;
    if (!d || d.kind !== "resize") {
      return;
    }
    const lim = limitsRef.current;
    const next = clampSize(
      d.startW + (2 * d.sx * (localX - d.localX)) / PX,
      d.startH + (2 * d.sy * (localY - d.localY)) / PX,
      lim.minW,
      lim.minH,
      lim.maxW,
      lim.maxH
    );
    const cur = sizeRef.current;
    if (next.w !== cur.w || next.h !== cur.h) {
      setSizeRef.current(next);
    }
  };

  const endChrome = (ev?: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    if (!d) {
      return;
    }
    const region = d.region;
    if (d.kind === "resize") {
      const cap = ev?.target as {
        releasePointerCapture?: (id: number) => void;
      } | null;
      if (ev) {
        cap?.releasePointerCapture?.(ev.pointerId);
      }
      drag.current = null;
      setDraggingRef.current(false);
    } else {
      drag.current = null;
      endMoveRef.current(ev);
    }
    notifyEndRef.current(region);
    show(region, hover.current === region, false);
    if (region === "handle" && hover.current !== "handle") {
      maybeClose();
    }
  };

  useEffect(() => {
    const a = anchor.current;
    if (!a) {
      return;
    }
    const off = registerCard({
      anchor: a,
      size: () => sizeRef.current,
      opts: () => optsRef.current,
      hover: (on, world) => {
        if (!on) {
          setHover("none");
          return;
        }
        if (!world) {
          return;
        }
        a.worldToLocal(localScratch.current.copy(world));
        const s = sizeRef.current;
        setHover(
          classify(
            localScratch.current.x,
            localScratch.current.y,
            s.w,
            s.h,
            NEAR_PAD,
            optsRef.current
          )
        );
      },
      begin: (world) => {
        a.worldToLocal(localScratch.current.copy(world));
        const s = sizeRef.current;
        const region = classify(
          localScratch.current.x,
          localScratch.current.y,
          s.w,
          s.h,
          NEAR_PAD,
          optsRef.current
        );
        if (region.startsWith("corner:")) {
          beginResizeAt(
            region.slice(7) as CornerId,
            localScratch.current.x,
            localScratch.current.y
          );
          return;
        }
        if (
          region.startsWith("edge:") ||
          region === "handle" ||
          region === "ring"
        ) {
          startMoveAtRef.current(world);
          drag.current = { kind: "move", region };
          show(region, true, true);
          notifyStartRef.current(region);
          if (region === "handle") {
            keepOpen();
          }
        }
      },
      update: (world) => {
        const d = drag.current;
        if (d?.kind === "resize") {
          a.worldToLocal(localScratch.current.copy(world));
          resizeToLocal(localScratch.current.x, localScratch.current.y);
          return;
        }
        if (d?.kind === "move") {
          moveToRef.current(world);
        }
      },
      end: () => endChrome(),
    });
    return () => {
      off();
      if (drag.current) {
        endChrome();
      }
    };
  }, [anchor]);

  const orbOuter = radius + outer;
  const orbDisc = useMemo(
    () => new THREE.CircleGeometry(Math.max(orbOuter, 0.001), 48),
    [orbOuter]
  );
  const orbRing = useMemo(
    () =>
      new THREE.RingGeometry(
        Math.max(radius + GAP - STROKE / 2, 0.0001),
        radius + GAP + STROKE / 2,
        48
      ),
    [radius]
  );
  const bandGeom = useMemo(
    () =>
      roundedRectGeometry(
        hw + outer,
        hh + outer,
        CARD_R + outer,
        handle ? HANDLE_DROP : 0
      ),
    [hw, hh, outer, handle]
  );
  const inset = CARD_R + 0.024 + 0.012;
  const hLen = Math.max(meters.w - 2 * inset, 0.01);
  const vLen = Math.max(meters.h - 2 * inset, 0.01);
  const hStroke = useMemo(() => stadiumGeometry(hLen, STROKE / 2), [hLen]);
  const vStroke = useMemo(() => stadiumGeometry(vLen, STROKE / 2), [vLen]);
  useEffect(() => () => orbDisc.dispose(), [orbDisc]);
  useEffect(() => () => orbRing.dispose(), [orbRing]);
  useEffect(() => () => bandGeom.dispose(), [bandGeom]);
  useEffect(() => () => hStroke.dispose(), [hStroke]);
  useEffect(() => () => vStroke.dispose(), [vStroke]);

  const paint = (region: Region, on: boolean, pressed = false) => {
    const t = themeRef.current;
    const color = pressed ? t.pressed : t.hover;
    if (region === "handle") {
      const idle = idleVis.current;
      if (
        idle &&
        "color" in idle.material &&
        idle.material.color instanceof THREE.Color
      ) {
        idle.material.color.set(
          pressed ? t.pressed : on ? t.hover : t.handleIdle
        );
      }
      return;
    }
    const mesh = strokes.current.get(region);
    if (!mesh) {
      return;
    }
    mesh.visible = on;
    const mat = mesh.material;
    if (mat && "color" in mat && mat.color instanceof THREE.Color) {
      mat.color.set(color);
    }
  };

  const show = (region: Region, on: boolean, pressed = false) => {
    paint(region, on, pressed);
  };

  const setHover = (region: Region) => {
    if (hover.current === region) {
      return;
    }
    if (hover.current !== "none") {
      show(hover.current, false);
      if (hover.current === "handle") {
        maybeClose();
      }
    }
    hover.current = region;
    if (region !== "none") {
      show(region, true);
      if (region === "handle") {
        keepOpen();
      }
    }
  };

  const bindStroke = (region: Region) => (node: THREE.Mesh | null) => {
    if (node) {
      strokes.current.set(region, node);
    } else {
      strokes.current.delete(region);
    }
  };

  const beginResize = (corner: CornerId, ev: ThreeEvent<PointerEvent>) => {
    const a = anchor.current;
    if (!a || drag.current) {
      return;
    }
    const local = rayOnCard(a, ev.ray);
    if (!local) {
      return;
    }
    const cap = ev.target as {
      setPointerCapture?: (id: number) => void;
    } | null;
    cap?.setPointerCapture?.(ev.pointerId);
    beginResizeAt(corner, local.x, local.y);
  };

  const onDown = (ev: ThreeEvent<PointerEvent>) => {
    const a = anchor.current;
    if (!a || drag.current) {
      return;
    }
    ev.stopPropagation();
    const local = rayOnCard(a, ev.ray);
    if (!local) {
      return;
    }
    const region = classify(
      local.x,
      local.y,
      sizeRef.current.w,
      sizeRef.current.h,
      HIT_PAD,
      optsRef.current
    );
    if (region.startsWith("corner:") && corners) {
      beginResize(region.slice(7) as CornerId, ev);
      return;
    }
    if (
      region.startsWith("edge:") ||
      region === "handle" ||
      region === "ring"
    ) {
      startMoveRef.current(ev);
      drag.current = { kind: "move", region };
      show(region, true, true);
      notifyStartRef.current(region);
      if (region === "handle") {
        keepOpen();
      }
    }
  };

  const onMove = (ev: ThreeEvent<PointerEvent>) => {
    const a = anchor.current;
    if (!a) {
      return;
    }
    const d = drag.current;
    if (d?.kind === "resize") {
      ev.stopPropagation();
      const local = rayOnCard(a, ev.ray);
      if (!local) {
        return;
      }
      resizeToLocal(local.x, local.y);
      return;
    }
    if (d?.kind === "move") {
      dragMoveRef.current(ev);
      return;
    }
    const local = rayOnCard(a, ev.ray);
    if (!local) {
      setHover("none");
      return;
    }
    setHover(
      classify(
        local.x,
        local.y,
        sizeRef.current.w,
        sizeRef.current.h,
        HIT_PAD,
        optsRef.current
      )
    );
  };

  const onUp = (ev: ThreeEvent<PointerEvent>) => {
    if (!drag.current) {
      return;
    }
    ev.stopPropagation();
    endChrome(ev);
  };

  const onOut = (ev: ThreeEvent<PointerEvent>) => {
    if (drag.current) {
      return;
    }
    const a = anchor.current;
    if (!a) {
      setHover("none");
      return;
    }
    const local = rayOnCard(a, ev.ray);
    if (local) {
      const region = classify(
        local.x,
        local.y,
        sizeRef.current.w,
        sizeRef.current.h,
        HIT_PAD,
        optsRef.current
      );
      if (region === "handle" || region === hover.current) {
        return;
      }
      setHover(region);
      return;
    }
    setHover("none");
  };

  const edgeAlong = (id: EdgeId) => (id === "t" ? hh : hw);
  const pillY = handleCenterY(hh);

  useFrame((_, dt) => {
    if (!handle) {
      return;
    }
    const goal =
      handleOpen.current || drag.current?.region === "handle" ? 1 : 0;
    expandT.current += (goal - expandT.current) * Math.min(1, 10 * dt);
    const t = expandT.current;
    if (idleVis.current) {
      idleVis.current.visible = t < 0.2;
    }
    if (expVis.current) {
      expVis.current.visible = t > 0.05;
      expVis.current.scale.set(
        THREE.MathUtils.lerp(HANDLE_LEN / HANDLE_EXP_LEN, 1, t),
        THREE.MathUtils.lerp(HANDLE_R / HANDLE_EXP_R, 1, t),
        1
      );
    }
  });

  if (shape === "orb") {
    return (
      <group name="card-chrome-orb">
        <mesh
          onPointerCancel={onUp}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerOut={onOut}
          onPointerUp={onUp}
          position={[0, 0, -0.001]}
          raycast={visibleRaycast}
        >
          <primitive attach="geometry" object={orbDisc} />
          <meshBasicMaterial
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
        <mesh
          position={[0, 0, 0.003]}
          raycast={() => {}}
          ref={bindStroke("ring")}
          visible={false}
        >
          <primitive attach="geometry" object={orbRing} />
          <meshBasicMaterial color={theme.hover} side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  }

  return (
    <group name="card-chrome">
      <mesh
        onPointerCancel={onUp}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerOut={onOut}
        onPointerUp={onUp}
        position={[0, 0, -0.001]}
        raycast={visibleRaycast}
      >
        <primitive attach="geometry" object={bandGeom} />
        <meshBasicMaterial
          depthWrite={false}
          opacity={0}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      {corners
        ? CORNER_LAYOUT.map((c) => (
            <group
              key={c.id}
              position={[c.sx * hw, c.sy * hh, 0.003]}
              rotation={[0, 0, c.rot]}
            >
              <mesh
                raycast={() => {}}
                ref={bindStroke(`corner:${c.id}`)}
                visible={false}
              >
                <primitive attach="geometry" object={CORNER_STROKE} />
                <meshBasicMaterial color={theme.hover} />
              </mesh>
            </group>
          ))
        : null}
      {EDGE_LAYOUT.filter((e) => edges.includes(e.id)).map((e) => {
        const horiz = e.id === "t";
        return (
          <group key={e.id} position={[0, 0, 0.003]} rotation={[0, 0, e.rot]}>
            <group position={[0, edgeAlong(e.id) + GAP, 0]}>
              <mesh
                raycast={() => {}}
                ref={bindStroke(`edge:${e.id}`)}
                visible={false}
              >
                <primitive
                  attach="geometry"
                  object={horiz ? hStroke : vStroke}
                />
                <meshBasicMaterial color={theme.hover} />
              </mesh>
            </group>
          </group>
        );
      })}
      {handle ? (
        <group name="card-handle" position={[0, pillY, 0.002]}>
          <mesh raycast={() => {}} ref={idleVis}>
            <primitive attach="geometry" object={HANDLE_GEOM} />
            <meshBasicMaterial color={theme.handleIdle} />
          </mesh>
          <group ref={expVis} visible={false}>
            <mesh raycast={() => {}}>
              <primitive attach="geometry" object={HANDLE_EXP_GEOM} />
              <meshBasicMaterial color={theme.hover} />
            </mesh>
          </group>
          <mesh
            onPointerCancel={onUp}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerOut={onOut}
            onPointerUp={onUp}
            position={[0, 0, 0.003]}
            raycast={visibleRaycast}
          >
            <primitive attach="geometry" object={HANDLE_EXP_GEOM} />
            <meshBasicMaterial
              depthWrite={false}
              opacity={0}
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
