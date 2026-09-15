"use client";

import { blocks } from "@workspace/registry";
import { BlockViewer } from "./block-viewer";

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
      {orderedBlocks().map((block) => (
        <section data-slot="blocks-gallery-item" key={block.name}>
          <BlockViewer name={block.name} />
        </section>
      ))}
    </div>
  );
}
