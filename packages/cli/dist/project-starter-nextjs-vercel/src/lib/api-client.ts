import { hc } from "hono/client";
import type { AppType } from "@/hono";
import { BASE_URL } from "./config";

const apiClient = hc<AppType>(`${BASE_URL}/`);

export { apiClient };
