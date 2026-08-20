import { createFileRoute } from "@tanstack/react-router";
import { BlocksGallery } from "@/components/blocks-gallery";
import { Announcement } from "@/components/general/announcement";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderPrimaryButton,
  PageHeaderSecondaryButton,
} from "@/components/layout/page-header";

const title = "Building Blocks for AI";
const description =
  "Beautifully designed. Copy and paste into your apps. Open Source.";

export const Route = createFileRoute("/blocks")({
  component: BlocksPage,
  head: () => ({
    meta: [{ title }, { content: description, name: "description" }],
  }),
});

function BlocksPage() {
  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <PageHeaderPrimaryButton render={<a href="#blocks" />}>
            Browse Blocks
          </PageHeaderPrimaryButton>
          <PageHeaderSecondaryButton render={<a href="/docs/installation" />}>
            See docs
          </PageHeaderSecondaryButton>
        </PageActions>
      </PageHeader>
      <div
        className="container-wrapper section-soft flex-1 md:py-6"
        id="blocks"
      >
        <div className="container">
          <BlocksGallery />
          <div className="mx-auto mt-16 max-w-2xl pb-16">
            <h2 className="font-medium text-xl tracking-tight">Installation</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Copy a block into your app with the shadcn CLI. The chat page
              pulls in the shell; the app shell is the layout on its own.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-code p-4 font-mono text-sm">
              {`npx shadcn@latest add @simple-ai/app-shell
npx shadcn@latest add @simple-ai/chat-page`}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
