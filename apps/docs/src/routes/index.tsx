import { createFileRoute } from "@tanstack/react-router";
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
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-16 text-center md:px-6 md:py-24">
        <p className="text-muted-foreground text-sm">
          Add the chat page to your app
        </p>
        <pre className="overflow-x-auto rounded-lg bg-code px-4 py-3 font-mono text-sm">
          npx shadcn@latest add @simple-ai/chat-page
        </pre>
      </div>
    </div>
  );
}
