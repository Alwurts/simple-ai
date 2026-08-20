import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { RootNotFound } from "@/components/not-found";
import { legacyAppHref } from "@/lib/legacy-redirects";

export const Route = createFileRoute("/$")({
  beforeLoad: ({ params }) => {
    const href = legacyAppHref(params._splat ?? "");
    if (href) {
      throw redirect({ href, statusCode: 301 });
    }
    throw notFound();
  },
  notFoundComponent: RootNotFound,
});
