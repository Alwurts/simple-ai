"use client";

import type {
  AgentExampleTurn,
  AgentToolMeta,
  AgentWireApi,
  RegistryMeta,
} from "@workspace/registry";
import { Bubble, BubbleContent } from "@workspace/ui/components/shadcn/bubble";
import { Button } from "@workspace/ui/components/shadcn/button";
import {
  Message,
  MessageContent,
  MessageGroup,
} from "@workspace/ui/components/shadcn/message";
import { Check, WrenchIcon } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/events";

function copyText(value: string, onCopied: () => void) {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return;
  }
  navigator.clipboard.writeText(value).then(onCopied, console.error);
}

function jsonPreview(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function AgentPills({ model, env }: { model?: string; env: string[] }) {
  const pills = ["ToolLoopAgent", model, ...env].filter(
    (pill): pill is string => Boolean(pill)
  );
  if (pills.length === 0) {
    return null;
  }
  return (
    <ul className="flex flex-wrap gap-1.5">
      {pills.map((pill) => (
        <li
          className="rounded-full border px-2 py-0.5 text-muted-foreground text-xs"
          key={pill}
        >
          {pill}
        </li>
      ))}
    </ul>
  );
}

function AgentTools({ tools }: { tools: AgentToolMeta[] }) {
  if (tools.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
        Tools
      </h3>
      <ul className="flex flex-col gap-3">
        {tools.map((tool) => (
          <li className="flex flex-col gap-1" key={tool.name}>
            <div className="flex flex-wrap items-baseline gap-2">
              <code className="font-mono text-sm">{tool.name}</code>
              <span className="text-muted-foreground text-sm">
                {tool.description}
              </span>
            </div>
            {tool.inputs && tool.inputs.length > 0 ? (
              <p className="text-muted-foreground text-xs">
                in{" "}
                {tool.inputs.map((input, index) => (
                  <span key={input.name}>
                    {index > 0 ? ", " : null}
                    <code>
                      {input.name}: {input.type}
                    </code>
                    {input.description ? ` (${input.description})` : null}
                  </span>
                ))}
              </p>
            ) : null}
            {tool.exampleOutput === undefined ? null : (
              <pre className="overflow-x-auto text-muted-foreground text-xs">
                out {jsonPreview(tool.exampleOutput)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FrozenTurn({ turn }: { turn: AgentExampleTurn }) {
  return (
    <MessageGroup className="gap-3">
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>{turn.user}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      {turn.tool ? (
        <div className="w-full max-w-[90%] rounded-md border p-3">
          <div className="flex items-center gap-2 text-sm">
            <WrenchIcon className="size-3.5 text-muted-foreground" />
            <code className="font-mono text-xs">{turn.tool.name}</code>
            <span className="text-muted-foreground text-xs">Completed</span>
          </div>
          <pre className="mt-2 overflow-x-auto text-muted-foreground text-xs">
            {jsonPreview(turn.tool.input)}
          </pre>
          <pre className="mt-1 overflow-x-auto text-xs">
            {jsonPreview(turn.tool.output)}
          </pre>
        </div>
      ) : null}
      <Message align="start">
        <MessageContent>
          <Bubble align="start" variant="muted">
            <BubbleContent>{turn.assistant}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  );
}

function SamplePrompts({ prompts }: { prompts: string[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  if (prompts.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
        Ask it
      </h3>
      <ul className="flex flex-col gap-1.5">
        {prompts.map((prompt) => (
          <li key={prompt}>
            <Button
              className="h-auto w-full justify-start whitespace-normal px-2 py-1.5 text-left font-normal text-xs"
              onClick={() => {
                copyText(prompt, () => {
                  setCopied(prompt);
                  window.setTimeout(() => setCopied(null), 2000);
                });
                trackEvent({
                  name: "example_used",
                  properties: { prompt },
                });
              }}
              size="sm"
              variant="outline"
            >
              {copied === prompt ? (
                <Check className="size-3.5 shrink-0" />
              ) : null}
              {prompt}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AgentWire({ ui, apis }: { ui?: string; apis: AgentWireApi[] }) {
  if (apis.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2 border-t pt-6">
      <p className="text-muted-foreground text-sm">
        This file aliases <code>assistant</code>. Add{" "}
        {ui ? <code>{ui}</code> : "a chat page"}, then one API, then point{" "}
        <code>chat-transport.ts</code> at <code>/api/chat</code>.{" "}
        <a
          className="underline-offset-2 hover:underline"
          href="/docs/installation"
        >
          Full steps
        </a>
      </p>
      <ul className="flex flex-col gap-2">
        {apis.map((api) => (
          <li
            className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3"
            key={api.stack}
          >
            <span className="w-36 shrink-0 text-muted-foreground text-sm">
              {api.stack}
            </span>
            <code className="font-mono text-xs">{api.item}</code>
            {api.note ? (
              <span className="text-muted-foreground text-xs">{api.note}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AgentOverview({ meta }: { meta: RegistryMeta }) {
  const tools = (meta.tools ?? []) as AgentToolMeta[];
  const samplePrompts = (meta.samplePrompts ?? []).filter(
    (prompt): prompt is string => typeof prompt === "string"
  );
  const env = (meta.env ?? []).filter(
    (name): name is string => typeof name === "string"
  );
  const apis = (meta.wire?.apis ?? []) as AgentWireApi[];
  const turn = meta.exampleTurn as AgentExampleTurn | undefined;

  return (
    <div
      className="min-h-80 rounded-xl border bg-background"
      data-slot="agent-overview"
    >
      <div className="flex flex-col gap-8 p-6">
        <div className="flex flex-col gap-2">
          {meta.summary ? <p className="text-sm">{meta.summary}</p> : null}
          <AgentPills env={env} model={meta.model} />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-6">
            {meta.instructions ? (
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                  Instructions
                </h3>
                <blockquote className="border-border border-l-2 pl-3 text-muted-foreground text-sm">
                  {meta.instructions}
                </blockquote>
              </div>
            ) : null}
            <AgentTools tools={tools} />
          </div>
          <div className="flex min-w-0 flex-col gap-6">
            {turn ? <FrozenTurn turn={turn} /> : null}
            <SamplePrompts prompts={samplePrompts} />
          </div>
        </div>
        <AgentWire apis={apis} ui={meta.wire?.ui} />
      </div>
    </div>
  );
}
