import { createFileRoute } from "@tanstack/react-router";
import { BlocksGallery } from "@/components/blocks-gallery";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderSecondaryButton,
} from "@/components/layout/page-header";
import { seo } from "@/lib/seo";

const title = "Examples";
const description =
  "Copy a complete chat page into your app. Change the source.";

export const Route = createFileRoute("/blocks")({
  component: BlocksPage,
  head: () =>
    seo({
      description,
      pathname: "/blocks",
      title: `simple-ai · ${title}`,
    }),
});

function BlocksPage() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <PageHeaderSecondaryButton render={<a href="/docs/installation" />}>
            Installation
          </PageHeaderSecondaryButton>
        </PageActions>
      </PageHeader>
      <div className="section-soft flex-1 px-4 md:px-6 md:py-6" id="blocks">
        <div className="mx-auto w-full max-w-6xl">
          <BlocksGallery />
          <div className="mx-auto mt-16 max-w-2xl pb-16">
            <h2 className="font-medium text-xl tracking-tight">Installation</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Copy the chat page with the shadcn CLI.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-code p-4 font-mono text-sm">
              npx shadcn@latest add @simple-ai/chat-page
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
