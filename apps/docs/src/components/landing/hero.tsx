"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import { useEffect, useRef, useState } from "react";
import { HeroChatPreview } from "@/components/landing/hero-chat-preview";

const STARTER_GENERATE =
  "https://github.com/Alwurts/simple-ai-starter/generate";

export function LandingHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }
    const onMove = (event: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      setPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    };
    root.addEventListener("mousemove", onMove);
    return () => root.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="relative overflow-x-clip bg-background" ref={rootRef}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <div
        className="pointer-events-none absolute inset-0"
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
          <p className="max-w-md text-balance text-muted-foreground text-sm md:text-base">
            Start a new app from the{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="/templates"
            >
              template
            </a>
            , or add the{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="/blocks"
            >
              block
            </a>{" "}
            to the one you have. Then change the source.
          </p>
          <div className="mt-2 grid w-full max-w-3xl gap-8 sm:grid-cols-2">
            <div className="flex flex-col items-center gap-3">
              <p className="font-medium">A new app</p>
              <p className="text-muted-foreground text-sm">
                An app with sign-in and an agent.
              </p>
              <Button
                className="rounded-full border-0 bg-brand text-brand-foreground hover:bg-brand/90"
                render={
                  <a href={STARTER_GENERATE} rel="noreferrer" target="_blank" />
                }
                size="sm"
              >
                Use this template
              </Button>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="font-medium">The app you have</p>
              <p className="text-muted-foreground text-sm">
                The chat page, copied into the app you already have.
              </p>
              <pre className="max-w-full overflow-x-auto rounded-lg bg-code px-4 py-3 font-mono text-sm">
                npx shadcn@latest add @simple-ai/chat-page
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full md:mt-8">
          <HeroChatPreview />
          <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground text-sm">
            The thread, the prompt, tools, thinking, and the work folded away so
            the answer stays readable.
          </p>
        </div>
      </div>
    </div>
  );
}
