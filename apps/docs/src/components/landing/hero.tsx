"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import { ArrowRight, Terminal } from "lucide-react";
import { useState } from "react";
import { Announcement } from "@/components/general/announcement";

export function LandingHero() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative flex min-h-[65vh] flex-col items-center justify-center overflow-hidden border-b bg-background md:min-h-[80vh]"
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
          opacity: 0.15,
        }}
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <Announcement size="lg" />
          <h1 className="max-w-4xl text-balance font-bold text-4xl tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            Build AI Chat <br className="hidden md:block" />
            <span className="text-muted-foreground">with shadcn</span>
          </h1>

          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            An open-source library of AI-focused UI components and app blocks
            designed to accelerate development. Built with shadcn/ui and the AI
            SDK.
          </p>

          <div className="flex w-full flex-col justify-center gap-4 px-4 sm:flex-row sm:px-0">
            <Button
              className="rounded-full border-0 bg-brand text-base text-brand-foreground hover:bg-brand/90"
              render={<a href="/docs/installation" />}
              size="lg"
            >
              Get Started
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              className="rounded-full text-base"
              render={<a href="/blocks" />}
              size="lg"
              variant="outline"
            >
              <Terminal className="mr-2 size-4" />
              Browse Components
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
