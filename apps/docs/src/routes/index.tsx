import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/shadcn/button";
import { ArrowRightIcon } from "lucide-react";
import { LandingHero } from "@/components/landing/hero";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "AI Building Blocks. Build Smarter, Faster." },
      {
        content:
          "An open-source library of AI-focused UI components and app blocks designed to accelerate development. Built with shadcn/ui and the AI SDK.",
        name: "description",
      },
    ],
  }),
});

function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <LandingHero />
      <div className="container-wrapper py-12 md:py-24">
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="font-bold text-3xl tracking-tight">
                Chat Interfaces
              </h2>
              <p className="text-lg text-muted-foreground">
                Production-ready chat with tools, files, mentions, and voice.
              </p>
            </div>
            <Button
              className="hidden md:flex"
              render={<a href="/blocks" />}
              variant="ghost"
            >
              View All
              <ArrowRightIcon className="ml-2 size-4" />
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
            <iframe
              className="hidden h-[720px] w-full bg-background lg:block"
              loading="lazy"
              src="/view/chat-page"
              title="Chat page"
            />
            <div className="p-6 lg:hidden">
              <a
                className="font-medium text-sm underline underline-offset-4"
                href="/view/chat-page"
              >
                Open the chat page preview
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
