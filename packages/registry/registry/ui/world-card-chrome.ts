import * as THREE from "three";

/** One millimetre per CSS pixel (uikit `pixelSize={0.001}`). */
export const PX = 0.001;
/** Matches the uikit card `borderRadius={12}`. */
export const CARD_R = 0.012;
export const GAP = 0.009;
export const STROKE = 0.003;
export const ARM = 0.024;
export const HIT_PAD = 0.008;
/** Break between the corner L and the mid-edge dash — assigned to the nearer region. */
export const EDGE_SEP = 0.012;
export const NEAR_PAD = 0.035;
export const HANDLE_R = 0.004;
export const HANDLE_GAP = 0.012;
export const HANDLE_LEN = 0.072;
export const HANDLE_EXP_R = 0.013;
export const HANDLE_EXP_LEN = 0.09;
/** Extra band below the face so the pill is on the same hit mesh. */
export const HANDLE_DROP = 0.02;

export function handleCenterY(hh: number) {
  return -hh - HANDLE_R - HANDLE_GAP;
}

export type CardSize = { w: number; h: number };
export type CornerId = "tl" | "tr" | "bl" | "br";
export type EdgeId = "t" | "l" | "r";
export type Region =
  | `corner:${CornerId}`
  | `edge:${EdgeId}`
  | "handle"
  | "ring"
  | "none";

export type ChromeOpts = {
  shape?: "card" | "orb";
  radius?: number;
  corners?: boolean;
  edges?: readonly EdgeId[];
  handle?: boolean;
};

export const NEAR_LEAVE = 1.5;

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

export function bandWidth(pad: number) {
  return GAP + STROKE / 2 + pad;
}

function insideRounded(
  x: number,
  y: number,
  hw: number,
  hh: number,
  r: number
): boolean {
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  if (ax > hw || ay > hh) {
    return false;
  }
  const cx = hw - r;
  const cy = hh - r;
  if (ax <= cx || ay <= cy) {
    return true;
  }
  return Math.hypot(ax - cx, ay - cy) <= r;
}

/** Card-local, origin at centre, +X right, +Y up. pad is HIT_PAD or NEAR_PAD. */
export function classify(
  x: number,
  y: number,
  wPx: number,
  hPx: number,
  pad: number,
  opts: ChromeOpts = {}
): Region {
  const outer = bandWidth(pad);
  if (opts.shape === "orb") {
    const r = opts.radius ?? 0;
    const d = Math.hypot(x, y);
    if (d < r) {
      return "none";
    }
    if (d <= r + outer) {
      return "ring";
    }
    return "none";
  }
  const corners = opts.corners !== false;
  const edges = opts.edges ?? (["t", "l", "r"] as const);
  const handle = opts.handle === true;
  const hw = (wPx * PX) / 2;
  const hh = (hPx * PX) / 2;
  const rOut = CARD_R + outer;
  const inFace = insideRounded(x, y, hw, hh, CARD_R);
  if (inFace) {
    return "none";
  }

  if (handle) {
    const handleY = handleCenterY(hh);
    const halfLen = HANDLE_EXP_LEN / 2;
    const radius = HANDLE_EXP_R + pad;
    const dy = y - handleY;
    const adx = Math.abs(x);
    const d = adx <= halfLen ? Math.abs(dy) : Math.hypot(adx - halfLen, dy);
    if (d <= radius) {
      return "handle";
    }
  }

  const inOuter = insideRounded(x, y, hw + outer, hh + outer, rOut);
  if (!inOuter || inFace) {
    return "none";
  }

  const inset = CARD_R + ARM + EDGE_SEP;
  const has = (e: EdgeId) => edges.includes(e);
  const ax = Math.abs(x);
  const ay = Math.abs(y);

  if (y > hh) {
    if (x > hw - inset && corners) {
      return "corner:tr";
    }
    if (x < -hw + inset && corners) {
      return "corner:tl";
    }
    if (has("t") && ax <= hw - inset) {
      return "edge:t";
    }
    if (corners) {
      return x >= 0 ? "corner:tr" : "corner:tl";
    }
    return "none";
  }
  if (y < -hh) {
    if (x > hw - inset && corners) {
      return "corner:br";
    }
    if (x < -hw + inset && corners) {
      return "corner:bl";
    }
    return "none";
  }
  if (x > hw) {
    if (y > hh - inset && corners) {
      return "corner:tr";
    }
    if (y < -hh + inset && corners) {
      return "corner:br";
    }
    if (has("r") && ay <= hh - inset) {
      return "edge:r";
    }
    if (corners) {
      return y >= 0 ? "corner:tr" : "corner:br";
    }
    return "none";
  }
  if (x < -hw) {
    if (y > hh - inset && corners) {
      return "corner:tl";
    }
    if (y < -hh + inset && corners) {
      return "corner:bl";
    }
    if (has("l") && ay <= hh - inset) {
      return "edge:l";
    }
    if (corners) {
      return y >= 0 ? "corner:tl" : "corner:bl";
    }
    return "none";
  }
  return "none";
}

export function cornerStrokeGeometry() {
  const rMid = CARD_R + GAP;
  const rOut = rMid + STROKE / 2;
  const rIn = rMid - STROKE / 2;
  const cx = -CARD_R;
  const cy = -CARD_R;
  const xOut = cx + rOut;
  const xIn = cx + rIn;
  const yOut = cy + rOut;
  const yIn = cy + rIn;
  const xEnd = cx - ARM;
  const yEnd = cy - ARM;
  const mid = GAP;
  const s = new THREE.Shape();
  s.moveTo(xEnd, yOut);
  s.lineTo(cx, yOut);
  s.absarc(cx, cy, rOut, Math.PI / 2, 0, true);
  s.lineTo(xOut, yEnd);
  s.absarc(mid, yEnd, STROKE / 2, 0, Math.PI, true);
  s.lineTo(xIn, cy);
  s.absarc(cx, cy, rIn, 0, Math.PI / 2, false);
  s.lineTo(xEnd, yIn);
  s.absarc(xEnd, mid, STROKE / 2, -Math.PI / 2, Math.PI / 2, true);
  s.closePath();
  return new THREE.ShapeGeometry(s, 16);
}

export function stadiumGeometry(length: number, radius: number) {
  const w = Math.max(length / 2, 0.0001);
  const r = radius;
  const s = new THREE.Shape();
  s.moveTo(-w, -r);
  s.lineTo(w, -r);
  s.absarc(w, 0, r, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(-w, r);
  s.absarc(-w, 0, r, Math.PI / 2, (3 * Math.PI) / 2, false);
  return new THREE.ShapeGeometry(s, 8);
}

export function roundedRectGeometry(
  hw: number,
  hh: number,
  r: number,
  extraBottom = 0
) {
  const top = hh;
  const bot = hh + extraBottom;
  const rr = Math.min(r, hw, top, bot);
  const s = new THREE.Shape();
  s.moveTo(-hw + rr, -bot);
  s.lineTo(hw - rr, -bot);
  s.absarc(hw - rr, -bot + rr, rr, -Math.PI / 2, 0, false);
  s.lineTo(hw, top - rr);
  s.absarc(hw - rr, top - rr, rr, 0, Math.PI / 2, false);
  s.lineTo(-hw + rr, top);
  s.absarc(-hw + rr, top - rr, rr, Math.PI / 2, Math.PI, false);
  s.lineTo(-hw, -bot + rr);
  s.absarc(-hw + rr, -bot + rr, rr, Math.PI, (3 * Math.PI) / 2, false);
  return new THREE.ShapeGeometry(s, 16);
}

const _plane = new THREE.Plane();
const _hit = new THREE.Vector3();
const _n = new THREE.Vector3();
const _o = new THREE.Vector3();

export function rayOnCard(
  parent: THREE.Object3D,
  ray: THREE.Ray
): THREE.Vector3 | null {
  parent.updateWorldMatrix(true, false);
  _n.set(0, 0, 1).transformDirection(parent.matrixWorld);
  parent.getWorldPosition(_o);
  _plane.setFromNormalAndCoplanarPoint(_n, _o);
  if (!ray.intersectPlane(_plane, _hit)) {
    return null;
  }
  return parent.worldToLocal(_hit);
}

function visibleInTree(obj: THREE.Object3D): boolean {
  let o: THREE.Object3D | null = obj;
  while (o) {
    if (!o.visible) {
      return false;
    }
    o = o.parent;
  }
  return true;
}

/** Skip ray hits when a parent WorldCard is hidden (wrist gate, card closed). */
export function visibleRaycast(
  this: THREE.Mesh,
  raycaster: THREE.Raycaster,
  intersects: THREE.Intersection[]
) {
  if (!visibleInTree(this)) {
    return;
  }
  THREE.Mesh.prototype.raycast.call(this, raycaster, intersects);
}

export const CORNER_LAYOUT = [
  { id: "tr" as const, sx: 1, sy: 1, rot: 0 },
  { id: "tl" as const, sx: -1, sy: 1, rot: Math.PI / 2 },
  { id: "bl" as const, sx: -1, sy: -1, rot: Math.PI },
  { id: "br" as const, sx: 1, sy: -1, rot: -Math.PI / 2 },
];

export const EDGE_LAYOUT = [
  { id: "t" as const, rot: 0 },
  { id: "r" as const, rot: -Math.PI / 2 },
  { id: "l" as const, rot: Math.PI / 2 },
];
