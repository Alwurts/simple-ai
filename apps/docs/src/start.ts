import { createMiddleware, createStart } from "@tanstack/react-start";
import { APEX_HOST, PUBLIC_HOST } from "@/lib/config";
import { legacyRegistryName } from "@/lib/legacy-redirects";

const REGISTRY_JSON = /^\/r\/([^/]+)\.json$/;

const redirects = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);
  if (url.hostname === APEX_HOST) {
    url.hostname = PUBLIC_HOST;
    url.protocol = "https:";
    return Response.redirect(url, 301);
  }

  const name = REGISTRY_JSON.exec(url.pathname)?.[1];
  const alias = name ? legacyRegistryName(name) : undefined;
  if (alias) {
    return Response.redirect(new URL(`/r/${alias}.json`, url), 301);
  }

  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [redirects],
}));
