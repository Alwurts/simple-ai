import { createFileRoute } from "@tanstack/react-router";
import { LandingHero } from "@/components/landing/hero";
import { siteConfig } from "@/lib/config";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () =>
    seo({
      description: siteConfig.tagline,
      pathname: "/",
      title: siteConfig.name,
    }),
});

function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <LandingHero />
      <div className="relative z-10 mx-auto grid w-full max-w-3xl gap-10 px-4 py-16 text-center md:grid-cols-2 md:px-6 md:py-24">
        <div className="flex flex-col items-center gap-3">
          <p className="font-medium">The whole template</p>
          <p className="text-muted-foreground text-sm">
            A private app, with this chat page already in it.
          </p>
          <a
            className="font-medium text-sm underline underline-offset-4"
            href="/templates"
          >
            Starter
          </a>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="font-medium">Just the block</p>
          <p className="text-muted-foreground text-sm">
            The chat page, copied into the app you already have.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-code px-4 py-3 font-mono text-sm">
            npx shadcn@latest add @simple-ai/chat-page
          </pre>
        </div>
      </div>
    </div>
  );
}
