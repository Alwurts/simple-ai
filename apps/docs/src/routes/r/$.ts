import { createFileRoute } from "@tanstack/react-router";
import { legacyRegistryName } from "@/lib/legacy-redirects";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const JSON_HEADERS = {
  ...CORS,
  "Content-Type": "application/json; charset=utf-8",
};

const registryFiles = import.meta.glob("../../../public/r/*.json", {
  eager: true,
  import: "default",
});

function liveRegistryJson(name: string) {
  const suffix = `/${name}.json`;
  for (const [path, json] of Object.entries(registryFiles)) {
    if (path.endsWith(suffix)) {
      return json;
    }
  }
}

function itemName(splat: string | undefined) {
  if (!splat?.endsWith(".json") || splat.includes("/")) {
    return;
  }
  return splat.slice(0, -".json".length);
}

export const Route = createFileRoute("/r/$")({
  server: {
    handlers: {
      OPTIONS({ params }) {
        if (!itemName(params._splat)) {
          return new Response(null, { status: 404 });
        }
        return new Response(null, { headers: CORS, status: 204 });
      },
      GET({ params, request }) {
        const name = itemName(params._splat);
        if (!name) {
          return new Response(null, { status: 404 });
        }
        const alias = legacyRegistryName(name);
        if (alias) {
          const location = new URL(`/r/${alias}.json`, request.url);
          return Response.redirect(location, 301);
        }
        const live = liveRegistryJson(name);
        if (live) {
          return new Response(JSON.stringify(live), { headers: JSON_HEADERS });
        }
        return new Response(
          JSON.stringify({
            error: "not_found",
            name,
            registry: "/r/registry.json",
          }),
          {
            headers: JSON_HEADERS,
            status: 404,
          }
        );
      },
    },
  },
});
