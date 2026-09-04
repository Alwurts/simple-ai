import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "collections/browser";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { Suspense } from "react";
import { DocsPage } from "@/components/docs/docs-page";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { getMDXComponents } from "@/components/mdx";
import { DocsNotFound } from "@/components/not-found";
import { docsNavFromTree, docsNeighbours } from "@/lib/docs-nav";
import { legacyDocsHref } from "@/lib/legacy-redirects";
import { source } from "@/lib/source";

export const Route = createFileRoute("/docs/$")({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/").filter(Boolean) ?? [];
    const data = await serverLoader({ data: slugs });
    if (!import.meta.env.SSR) {
      await clientLoader.preload(data.path);
    }
    return data;
  },
  notFoundComponent: DocsNotFound,
});

const serverLoader = createServerFn({ method: "GET" })
  .validator((slugs: string[]) => slugs)
  .handler(({ data: slugs }) => {
    const path = slugs.join("/");
    const legacyHref = legacyDocsHref(path);
    if (legacyHref) {
      throw redirect({ href: legacyHref, statusCode: 301 });
    }

    const page = source.getPage(slugs);
    if (!page) {
      throw notFound();
    }

    const tree = source.getPageTree();
    const neighbours = docsNeighbours(tree, page.url);

    return {
      path: page.path,
      url: page.url,
      nav: docsNavFromTree(tree),
      previous: neighbours.previous,
      next: neighbours.next,
    };
  });

const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, frontmatter, default: MDX }) {
    // biome-ignore lint/correctness/useHookAtTopLevel: fumadocs clientLoader `component` is a React component
    const { previous, next, url } = Route.useLoaderData();

    return (
      <DocsPage
        description={
          typeof frontmatter.description === "string"
            ? frontmatter.description
            : undefined
        }
        next={next}
        previous={previous}
        title={String(frontmatter.title ?? "Docs")}
        toc={toc}
        url={url}
      >
        <MDX components={getMDXComponents()} />
      </DocsPage>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData());

  return (
    <div className="container-wrapper flex flex-1 flex-col px-4 md:px-8">
      <div className="flex flex-1 items-start lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <DocsSidebar groups={data.nav} />
        <div className="relative w-full min-w-0">
          <Suspense fallback={<DocsPageLoading />}>
            {clientLoader.useContent(data.path)}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function DocsPageLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-6 text-muted-foreground text-sm">
      Loading…
    </div>
  );
}
