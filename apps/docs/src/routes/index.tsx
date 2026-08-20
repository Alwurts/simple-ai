import { createFileRoute } from "@tanstack/react-router";
import { LandingHero } from "@/components/landing/hero";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "simple-ai · Chat UI for shadcn" },
      {
        content: "Chat UI for shadcn. Copy it into your app.",
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
          Copy a chat page into your app.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-code px-4 py-3 font-mono text-sm">
          npx shadcn@latest add @simple-ai/chat-page
        </pre>
      </div>
    </div>
  );
}
