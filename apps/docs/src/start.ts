import { createMiddleware, createStart } from "@tanstack/react-start";
import { APEX_HOST, PUBLIC_HOST } from "@/lib/config";

const canonicalHost = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);
  if (url.hostname !== APEX_HOST) {
    return next();
  }
  url.hostname = PUBLIC_HOST;
  url.protocol = "https:";
  return Response.redirect(url, 301);
});

export const startInstance = createStart(() => ({
  requestMiddleware: [canonicalHost],
}));
