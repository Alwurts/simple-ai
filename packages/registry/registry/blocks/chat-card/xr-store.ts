import { createXRStore } from "@react-three/xr";

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

export function enterAR() {
  return xrStore.enterAR();
}

export function enterVR() {
  return xrStore.enterVR();
}
