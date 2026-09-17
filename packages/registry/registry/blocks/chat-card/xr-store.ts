import { createXRStore } from "@react-three/xr";

const CURSOR_OFFSET = 0.001;

const rightRay = {
  minDistance: 0.02,
  rayModel: { opacity: 0.55, color: "#e4e4e7" },
  cursorModel: {
    opacity: 0.9,
    size: 0.006,
    color: "#2563eb",
    cursorOffset: CURSOR_OFFSET,
  },
};

const hands = {
  model: true,
  grabPointer: true,
  touchPointer: true,
  rayPointer: {
    minDistance: 0.02,
    rayModel: { opacity: 0.4, color: "#e4e4e7", maxLength: 1.2 },
    cursorModel: {
      opacity: 0.85,
      size: 0.005,
      color: "#2563eb",
      cursorOffset: CURSOR_OFFSET,
    },
  },
} as const;

export const xrStore = createXRStore({
  foveation: 0.5,
  offerSession: false,
  bounded: true,
  hitTest: false,
  domOverlay: false,
  anchors: false,
  meshDetection: false,
  planeDetection: false,
  depthSensing: false,
  bodyTracking: false,
  handTracking: true,
});

function applyARInput() {
  xrStore.setController(
    { model: false, rayPointer: false, grabPointer: false },
    "left"
  );
  xrStore.setController(
    { model: false, rayPointer: rightRay, grabPointer: true },
    "right"
  );
  xrStore.setHand(hands, "left");
  xrStore.setHand(hands, "right");
}

function applyVRInput() {
  xrStore.setController(
    { model: true, rayPointer: false, grabPointer: true },
    "left"
  );
  xrStore.setController(
    { model: true, rayPointer: rightRay, grabPointer: true },
    "right"
  );
  xrStore.setHand(hands, "left");
  xrStore.setHand(hands, "right");
}

export function enterAR() {
  applyARInput();
  return xrStore.enterAR();
}

export function enterVR() {
  applyVRInput();
  return xrStore.enterVR();
}
