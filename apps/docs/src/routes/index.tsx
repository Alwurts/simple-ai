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
    </div>
  );
}
