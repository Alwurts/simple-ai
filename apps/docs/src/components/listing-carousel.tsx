"use client";

import { getEntry } from "@workspace/registry";
import { Button } from "@workspace/ui/components/shadcn/button";
import { TooltipProvider } from "@workspace/ui/components/shadcn/tooltip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";

export interface ListingSlide {
  title: string;
  description: string;
  name: string;
  frame: "app" | "piece";
}

export function ListingCarousel({
  label,
  slides,
}: {
  label: string;
  slides: ListingSlide[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    const update = () => {
      setAtStart(scroller.scrollLeft <= 1);
      setAtEnd(
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1
      );
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scrollBySlide = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    const slide = scroller?.querySelector<HTMLElement>(
      "[data-slot=listing-slide]"
    );
    if (!(scroller && slide)) {
      return;
    }
    const gap = 16;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    scroller.scrollBy({
      left: direction * (slide.offsetWidth + gap),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section aria-label={label} aria-roledescription="carousel">
      <div className="relative">
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={scrollerRef}
        >
          {slides.map((slide) => (
            <figure
              className="w-[min(78vw,32rem)] shrink-0 snap-start"
              data-slot="listing-slide"
              key={slide.name}
            >
              <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                {slide.frame === "app" ? (
                  <AppFrame name={slide.name} title={slide.title} />
                ) : (
                  <PieceFrame name={slide.name} />
                )}
              </div>
              <figcaption className="mt-3 max-w-md">
                <p className="font-medium text-sm">{slide.title}</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  {slide.description}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        {slides.length > 1 ? (
          <>
            <CarouselButton
              direction={-1}
              hidden={atStart}
              label="Previous"
              onClick={() => scrollBySlide(-1)}
            />
            <CarouselButton
              direction={1}
              hidden={atEnd}
              label="Next"
              onClick={() => scrollBySlide(1)}
            />
          </>
        ) : null}
      </div>
    </section>
  );
}

function CarouselButton({
  direction,
  hidden,
  label,
  onClick,
}: {
  direction: -1 | 1;
  hidden: boolean;
  label: string;
  onClick: () => void;
}) {
  const Icon = direction === -1 ? ChevronLeft : ChevronRight;
  return (
    <Button
      aria-label={label}
      className={`absolute top-[28%] z-10 size-8 rounded-full bg-background/90 shadow-sm disabled:pointer-events-none disabled:opacity-0 ${direction === -1 ? "left-2" : "right-2"}`}
      disabled={hidden}
      onClick={onClick}
      size="icon"
      variant="outline"
    >
      <Icon className="size-4" />
    </Button>
  );
}

function AppFrame({ name, title }: { name: string; title: string }) {
  return (
    <div className="relative aspect-[8/5] bg-background">
      <iframe
        className="pointer-events-none absolute inset-0 size-full border-0"
        loading="lazy"
        src={`/view/${name}`}
        tabIndex={-1}
        title={title}
      />
    </div>
  );
}

function PieceFrame({ name }: { name: string }) {
  const entry = getEntry(name);
  if (!entry) {
    return <div className="aspect-[8/5] bg-background" />;
  }
  const Demo = entry.component;
  return (
    <div className="flex aspect-[8/5] items-center justify-center bg-background p-6">
      <TooltipProvider delay={0}>
        <Suspense fallback={null}>
          <div className="w-full max-w-md">
            <Demo />
          </div>
        </Suspense>
      </TooltipProvider>
    </div>
  );
}
