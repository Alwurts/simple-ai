"use client";

import { useEffect, useRef } from "react";

const REST_ROTATE = 3;
const MAX_ROTATE = 6;

export function HeroChatPreview() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!(stage && card)) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px)");

    const apply = (rotate: number) => {
      card.style.transform = `rotateX(${rotate}deg)`;
    };

    let frame = 0;
    const update = () => {
      if (motionQuery.matches || compactQuery.matches) {
        apply(0);
        return;
      }
      const rect = stage.getBoundingClientRect();
      const view = window.innerHeight;
      const start = view * 0.12;
      const end = Math.min(view * -0.1, -rect.height * 0.12);
      const progress = Math.min(
        1,
        Math.max(0, (start - rect.top) / (start - end))
      );
      const rotate = REST_ROTATE + progress * (MAX_ROTATE - REST_ROTATE);
      apply(rotate);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compactQuery.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      compactQuery.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <div
      className="relative mx-auto w-full md:[perspective-origin:50%_50%] md:[perspective:2600px]"
      data-slot="hero-chat-preview"
      ref={stageRef}
    >
      <div
        className="relative overflow-hidden rounded-xl border bg-background shadow-lg md:origin-center md:shadow-xl md:will-change-transform md:[transform:rotateX(3deg)]"
        ref={cardRef}
      >
        <iframe
          className="block h-[32rem] w-full bg-background md:h-[34rem] lg:h-[40rem]"
          src="/view/chat-page"
          title="Chat page preview"
        />
      </div>
    </div>
  );
}
