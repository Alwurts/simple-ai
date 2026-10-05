"use client";

import { blocks } from "@workspace/registry";
import { BlockViewer } from "./block-viewer";
import { ListingCarousel, type ListingSlide } from "./listing-carousel";

const BLOCK_SLIDES: Record<string, ListingSlide[]> = {
  "chat-page": [
    {
      title: "The whole screen",
      description:
        "The thread, the prompt, tools, thinking, and the work folded away so the answer stays readable.",
      name: "chat-page",
      frame: "app",
    },
    {
      title: "The work, folded",
      description:
        "Open the steps when you want them. The answer stays on screen.",
      name: "worked",
      frame: "piece",
    },
    {
      title: "A tool call",
      description: "Input and output, quiet until you open them.",
      name: "tool",
      frame: "piece",
    },
    {
      title: "The prompt",
      description: "Mentions and send, in the thread.",
      name: "chat-input",
      frame: "piece",
    },
  ],
};

const BLOCK_ORDER = ["chat-page"];

function orderedBlocks() {
  const visible = blocks;
  const byName = new Map(visible.map((block) => [block.name, block]));
  const ordered = BLOCK_ORDER.map((name) => byName.get(name)).filter(
    (block) => block !== undefined
  );
  const rest = visible.filter((block) => !BLOCK_ORDER.includes(block.name));
  return [...ordered, ...rest];
}

export function BlocksGallery() {
  return (
    <div className="not-prose flex flex-col gap-12">
      {orderedBlocks().map((block) => {
        const slides = BLOCK_SLIDES[block.name];
        return (
          <section
            className="flex flex-col gap-8"
            data-slot="blocks-gallery-item"
            key={block.name}
          >
            {slides ? (
              <ListingCarousel
                label={block.title ?? block.name}
                slides={slides}
              />
            ) : null}
            <BlockViewer name={block.name} />
          </section>
        );
      })}
    </div>
  );
}
