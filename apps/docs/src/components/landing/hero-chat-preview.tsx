"use client";

import { useEffect, useRef } from "react";

const EMBED_STYLE_ID = "hero-chat-embed-scroll";
const EMBED_SCROLL_CSS = `[data-slot="view-page"] * {
  scrollbar-width: none;
  scrollbar-gutter: auto;
}
[data-slot="view-page"] *::-webkit-scrollbar {
  display: none;
}`;

function hidePosterScrollbars(iframe: HTMLIFrameElement) {
  const doc = iframe.contentDocument;
  if (!doc || doc.getElementById(EMBED_STYLE_ID)) {
    return;
  }
  const style = doc.createElement("style");
  style.id = EMBED_STYLE_ID;
  style.textContent = EMBED_SCROLL_CSS;
  doc.head.appendChild(style);
}

export function HeroChatPreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }
    const onLoad = () => hidePosterScrollbars(iframe);
    iframe.addEventListener("load", onLoad);
    if (iframe.contentDocument?.readyState === "complete") {
      hidePosterScrollbars(iframe);
    }
    return () => iframe.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="relative mx-auto w-full" data-slot="hero-chat-preview">
      <div className="relative overflow-hidden rounded-xl border bg-background shadow-lg md:shadow-xl">
        <iframe
          className="block h-[32rem] w-full bg-background md:h-[34rem] lg:h-[40rem]"
          ref={iframeRef}
          src="/view/chat-page"
          title="Chat page preview"
        />
      </div>
    </div>
  );
}
