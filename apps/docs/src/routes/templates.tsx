import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header";
import { seo } from "@/lib/seo";

const title = "Templates";
const description = "The whole app. Or copy just the chat page.";

const STARTER_REPO = "https://github.com/Alwurts/simple-ai-starter";

export const Route = createFileRoute("/templates")({
  component: TemplatesPage,
  head: () =>
    seo({
      description,
      pathname: "/templates",
      title: `simple-ai · ${title}`,
    }),
});

function TemplatesPage() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
      </PageHeader>
      <div className="section-soft flex-1 px-4 md:px-6 md:py-6" id="templates">
        <div className="mx-auto grid w-full max-w-6xl gap-6 pb-16 md:grid-cols-2">
          <article className="flex flex-col gap-4 rounded-xl border bg-background p-6">
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-xl tracking-tight">Starter</h2>
              <p className="text-muted-foreground text-sm">
                A private app. People sign in, name the organization, and talk
                to an agent. The chat is the{" "}
                <a
                  className="font-medium text-foreground underline underline-offset-4"
                  href="/blocks"
                >
                  chat page
                </a>
                . You can also copy just that page.
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              <Button
                className="rounded-full border-0 bg-brand text-brand-foreground hover:bg-brand/90"
                render={
                  <a
                    href={`${STARTER_REPO}/generate`}
                    rel="noreferrer"
                    target="_blank"
                  />
                }
                size="sm"
              >
                Use this template
              </Button>
              <Button
                className="rounded-full"
                render={
                  <a href={STARTER_REPO} rel="noreferrer" target="_blank" />
                }
                size="sm"
                variant="outline"
              >
                View on GitHub
              </Button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
