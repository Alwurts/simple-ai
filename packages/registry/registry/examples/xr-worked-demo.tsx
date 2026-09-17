"use client";

import { xrDemo } from "./xr-demo-lazy";

export default xrDemo(() => import("./xr-worked-demo-scene"));
