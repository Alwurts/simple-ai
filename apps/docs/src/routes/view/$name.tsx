import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getEntry } from "@workspace/registry";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { Suspense } from "react";
import { BlockNotFound } from "@/components/not-found";
import { siteConfig } from "@/lib/config";
import { legacyViewHref } from "@/lib/legacy-redirects";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/view/$name")({
  beforeLoad: ({ params }) => {
    const href = legacyViewHref(params.name);
    if (href) {
      throw redirect({ href, statusCode: 301 });
    }
  },
  loader: ({ params }) => {
    if (!getEntry(params.name)) {
      throw notFound();
    }
    return {
      name: params.name,
    };
  },
  head: ({ params }) =>
    seo({
      description: siteConfig.tagline,
      noindex: true,
      pathname: `/view/${params.name}`,
      title: `simple-ai · ${params.name}`,
    }),
  component: ViewBlock,
  notFoundComponent: BlockNotFound,
});
function ViewBlock() {
  const { name } = Route.useLoaderData();
  const entry = getEntry(name);
  if (!entry) {
    return <BlockNotFound />;
  }
  const Preview = entry.component;
  return (
    <div className="h-dvh overflow-hidden" data-slot="view-page">
      <TooltipProvider delay={0}>
        <Suspense fallback={null}>
          <Preview />
        </Suspense>
      </TooltipProvider>
    </div>
  );
}
