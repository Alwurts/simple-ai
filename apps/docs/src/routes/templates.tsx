import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header";
import {
  ListingCarousel,
  type ListingSlide,
} from "@/components/listing-carousel";
import { seo } from "@/lib/seo";

const title = "Templates";
const description = "Complete apps to start a new project from.";

const STARTER_REPO = "https://github.com/Alwurts/simple-ai-starter";

const starterSlides: ListingSlide[] = [
  {
    title: "The thread",
    description:
      "The app opens on this chat. People sign in and talk to an agent.",
    name: "chat-page",
    frame: "app",
  },
  {
    title: "The work, folded",
    description:
      "The agent's steps stay folded. The answer stays on the screen.",
    name: "worked",
    frame: "piece",
  },
  {
    title: "A tool call",
    description: "What the agent used, and what came back.",
    name: "tool",
    frame: "piece",
  },
  {
    title: "The prompt",
    description: "Type, mention someone, and send.",
    name: "chat-input",
    frame: "piece",
  },
];

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
        <article className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex max-w-xl flex-col gap-2">
              <h2 className="font-medium text-xl tracking-tight">Starter</h2>
              <p className="text-muted-foreground text-sm">
                An app with sign-in and an agent. People sign in, name the
                organization, and talk to an agent. The chat is the{" "}
                <a
                  className="font-medium text-foreground underline underline-offset-4"
                  href="/blocks"
                >
                  chat page
                </a>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
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
          </div>
          <ListingCarousel label="Starter" slides={starterSlides} />
        </article>
      </div>
    </>
  );
}
