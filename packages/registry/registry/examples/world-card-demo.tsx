"use client";

import { vrDemo } from "./vr-demo-lazy";

export default vrDemo(() => import("./world-card-demo-scene"));
