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
]);

const LIVE_COMPONENT_DOCS = new Set([
  "chat-input",
  "chat-voice-button",
  "reasoning",
  "shell",
  "tool",
]);

const RETIRED_APP_PATHS: Record<string, string> = {
  "ai-agents": "/agents",
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
    return "/agents";
  }
  if (startsWithPath(path, "workflows") || startsWithPath(path, "react-flow")) {
    return "/docs";
  }
  if (startsWithPath(path, "components")) {
    const name = path.slice("components/".length);
    if (name && !LIVE_COMPONENT_DOCS.has(name)) {
      return "/docs/components/chat-input";
    }
  }
}

/** `/view/:name` — old block previews. */
export function legacyViewHref(name: string): string | undefined {
  if (RETIRED_CHAT_VIEWS.has(name)) {
    return "/view/chat-page";
  }
  if (RETIRED_BLOCK_VIEWS.has(name)) {
    return "/blocks";
  }
}

/** Top-level app pages that no longer exist (`/ai-agents`, `/blocks/chat`, …). */
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
  if (startsWithPath(trimmed, "blocks")) {
    return "/blocks";
  }
}
