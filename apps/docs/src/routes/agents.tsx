import { createFileRoute } from "@tanstack/react-router";
import { AgentsGallery } from "@/components/agents-gallery";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderSecondaryButton,
} from "@/components/layout/page-header";

const title = "Agents";
const description = "Copy a ToolLoopAgent into your app.";

export const Route = createFileRoute("/agents")({
  component: AgentsPage,
  head: () => ({
    meta: [{ title }, { content: description, name: "description" }],
  }),
});

function AgentsPage() {
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
      <div className="section-soft flex-1 px-4 md:px-6 md:py-6" id="agents">
        <div className="mx-auto w-full max-w-6xl">
          <AgentsGallery />
          <div className="mx-auto mt-16 max-w-2xl pb-16">
            <h2 className="font-medium text-xl tracking-tight">Installation</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Copy an agent into your app with the shadcn CLI, then add a chat
              API and point the chat transport at /api/chat.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-code p-4 font-mono text-sm">
              npx shadcn@latest add @simple-ai/weather-agent
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
