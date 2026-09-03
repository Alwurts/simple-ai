"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { HeroChatPreview } from "@/components/landing/hero-chat-preview";

export function LandingHero() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative overflow-x-hidden bg-background"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <div
        className="pointer-events-none absolute -inset-px"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--brand), transparent 40%)`,
          opacity: 0.12,
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-6 pb-10 md:px-6 md:pt-8 md:pb-16">
        <div className="flex flex-col items-center gap-3 text-center md:gap-4">
          <h1 className="max-w-2xl text-balance font-semibold text-2xl tracking-tight md:text-4xl">
            Curated agent examples{" "}
            <span className="text-muted-foreground">you can build upon</span>
          </h1>
          <p className="max-w-md text-muted-foreground text-sm md:text-base">
            Copy them into your app. Change the source.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button
              className="rounded-full border-0 bg-brand text-brand-foreground hover:bg-brand/90"
              render={<a href="/docs/installation" />}
              size="sm"
            >
              Get started
              <ArrowRight className="size-3.5" />
            </Button>
            <Button
              className="rounded-full"
              render={<a href="/view/chat-page" />}
              size="sm"
              variant="outline"
            >
              Open preview
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="mt-6 w-full md:mt-8">
          <HeroChatPreview />
        </div>
      </div>
    </div>
  );
}
