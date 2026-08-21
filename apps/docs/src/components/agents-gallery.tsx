"use client";

import { agents } from "@workspace/registry";
import { BlockViewer } from "./block-viewer";

/** Gallery order on the agents index — new agents append at the end if omitted. */
const AGENT_ORDER = ["weather-agent"];

function orderedAgents() {
  const byName = new Map(agents.map((agent) => [agent.name, agent]));
  const ordered = AGENT_ORDER.map((name) => byName.get(name)).filter(
    (agent) => agent !== undefined
  );
  const rest = agents.filter((agent) => !AGENT_ORDER.includes(agent.name));
  return [...ordered, ...rest];
}

export function AgentsGallery() {
  return (
    <div className="not-prose flex flex-col gap-12">
      {orderedAgents().map((agent) => (
        <section data-slot="agents-gallery-item" key={agent.name}>
          <BlockViewer name={agent.name} />
        </section>
      ))}
    </div>
  );
}
