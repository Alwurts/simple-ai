/** Permanent redirects for URLs from the old Next.js simple-ai site. */

const RETIRED_CHAT_VIEWS = new Set([
  "chat-01",
  "chat-02",
  "chat-03",
  "chat-04",
]);

const RETIRED_BLOCK_VIEWS = new Set([
  "app-01",
  "app-02",
  "app-03",
  "flow-chain",
  "flow-orchestrator",
  "flow-parallelization",
  "flow-routing",
  "workflow-01",
  "app-shell",
]);

const LIVE_COMPONENT_DOCS = new Set([
  "chat-input",
  "tool",
  "worked",
  "world-card",
  "xr-button",
  "xr-chat-input",
  "xr-tool",
  "xr-worked",
  "xr-reasoning",
  "xr-markdown",
]);

const REGISTRY_ALIASES: Record<string, string> = {
  composer: "chat-input",
  "chat-01": "chat-page",
  "chat-02": "chat-page",
  "chat-03": "chat-page",
  "chat-04": "chat-page",
};

const RETIRED_APP_PATHS: Record<string, string> = {
  "ai-agents": "/blocks",
  agents: "/blocks",
  "ai-workflows": "/docs",
  playground: "/docs",
  canvas: "/docs",
};

function startsWithPath(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** `/docs/...` splat without the `/docs/` prefix. */
export function legacyDocsHref(path: string): string | undefined {
  if (path === "blocks" || startsWithPath(path, "blocks")) {
    return "/blocks";
  }
  if (startsWithPath(path, "agents")) {
    return "/blocks";
  }
  if (startsWithPath(path, "workflows") || startsWithPath(path, "react-flow")) {
    return "/docs";
  }
  if (startsWithPath(path, "components")) {
    const name = path.slice("components/".length);
    if (name === "composer") {
      return "/docs/components/chat-input";
    }
    if (name === "chat-voice-button") {
      return "/docs/components";
    }
    if (name && !LIVE_COMPONENT_DOCS.has(name)) {
      return "/docs/components/chat-input";
    }
  }
}

export function legacyViewHref(name: string): string | undefined {
  if (name === "composer") {
    return "/view/chat-input";
  }
  if (RETIRED_CHAT_VIEWS.has(name)) {
    return "/view/chat-page";
  }
  if (RETIRED_BLOCK_VIEWS.has(name)) {
    return "/blocks";
  }
}

export function legacyRegistryName(name: string): string | undefined {
  return REGISTRY_ALIASES[name];
}

export function legacyAppHref(path: string): string | undefined {
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  if (!trimmed) {
    return;
  }
  if (trimmed in RETIRED_APP_PATHS) {
    return RETIRED_APP_PATHS[trimmed];
  }
  if (startsWithPath(trimmed, "playground")) {
    return "/docs";
  }
  if (startsWithPath(trimmed, "agents")) {
    return "/blocks";
  }
  if (startsWithPath(trimmed, "blocks")) {
    return "/blocks";
  }
}
