"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Euler, Vector3 } from "three";

const EYE_HEIGHT = 1.6;
const LOOK_SPEED = 0.0022;
const MOVE_SPEED = 1.6;
const PITCH_LIMIT = 1.2;
const euler = new Euler(0, 0, 0, "YXZ");
const forward = new Vector3();
const right = new Vector3();

export function LookControls({ enabled }: { enabled: boolean }) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const looking = useRef(false);
  const keys = useRef(new Set<string>());
  const origin = useRef(new Vector3(0, EYE_HEIGHT, 0.15));

  useEffect(() => {
    camera.position.copy(origin.current);
    camera.rotation.set(0, 0, 0, "YXZ");
  }, [camera]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const el = gl.domElement;
    el.tabIndex = 0;
    el.style.touchAction = "none";

    const onContextMenu = (event: Event) => {
      event.preventDefault();
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
    };
    const onPointerDown = (event: PointerEvent) => {
      el.focus();
      if (event.button === 2 || event.button === 1) {
        looking.current = true;
        el.setPointerCapture(event.pointerId);
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      if (event.button === 2 || event.button === 1) {
        looking.current = false;
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      const locked = document.pointerLockElement === el;
      if (!(locked || looking.current)) {
        return;
      }
      yaw.current -= event.movementX * LOOK_SPEED;
      pitch.current -= event.movementY * LOOK_SPEED;
      pitch.current = Math.max(
        -PITCH_LIMIT,
        Math.min(PITCH_LIMIT, pitch.current)
      );
    };
    const onKeyDown = (event: KeyboardEvent) => {
      keys.current.add(event.code);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code);
    };
    const onBlur = () => {
      keys.current.clear();
      looking.current = false;
    };

    el.addEventListener("contextmenu", onContextMenu);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("keydown", onKeyDown);
    el.addEventListener("keyup", onKeyUp);
    el.addEventListener("blur", onBlur);
    return () => {
      el.removeEventListener("contextmenu", onContextMenu);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("keydown", onKeyDown);
      el.removeEventListener("keyup", onKeyUp);
      el.removeEventListener("blur", onBlur);
    };
  }, [enabled, gl]);

  useFrame((_, dt) => {
    if (!enabled) {
      return;
    }
    euler.set(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);
    const held = keys.current;
    if (held.size === 0) {
      camera.position.y = EYE_HEIGHT;
      return;
    }
    forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    if (forward.lengthSq() > 1e-6) {
      forward.normalize();
    }
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    if (right.lengthSq() > 1e-6) {
      right.normalize();
    }
    const step = MOVE_SPEED * dt;
    if (held.has("KeyW") || held.has("ArrowUp")) {
      origin.current.addScaledVector(forward, step);
    }
    if (held.has("KeyS") || held.has("ArrowDown")) {
      origin.current.addScaledVector(forward, -step);
    }
    if (held.has("KeyA") || held.has("ArrowLeft")) {
      origin.current.addScaledVector(right, -step);
    }
    if (held.has("KeyD") || held.has("ArrowRight")) {
      origin.current.addScaledVector(right, step);
    }
    origin.current.y = EYE_HEIGHT;
    camera.position.copy(origin.current);
  });

  return null;
}

export function requestLookLock(canvas: HTMLCanvasElement) {
  void canvas.requestPointerLock();
}
