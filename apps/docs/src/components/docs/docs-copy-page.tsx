"use client";

import { Button } from "@workspace/ui/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/shadcn/dropdown-menu";
import { CheckIcon, ChevronDownIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/config";

function promptUrl(base: string, pageUrl: string) {
  const absolute = `${siteConfig.url}${pageUrl}`;
  return `${base}?q=${encodeURIComponent(
    `I'm looking at this simple-ai documentation: ${absolute}. Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`
  )}`;
}

export function DocsCopyPage({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const markdownUrl = `${url}.md`;

  return (
    <div className="flex items-center">
      <Button
        className="rounded-r-none shadow-none"
        onClick={() => {
          navigator.clipboard
            .writeText(`${siteConfig.url}${markdownUrl}`)
            .then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            }, console.error);
        }}
        size="sm"
        variant="secondary"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        Copy page
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              className="rounded-l-none border-l-0 px-2 shadow-none"
              size="sm"
              variant="secondary"
            />
          }
        >
          <ChevronDownIcon />
          <span className="sr-only">More copy options</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            render={<a href={markdownUrl} rel="noreferrer" target="_blank" />}
          >
            View as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <a
                href={promptUrl("https://chatgpt.com", url)}
                rel="noreferrer"
                target="_blank"
              />
            }
          >
            Open in ChatGPT
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <a
                href={promptUrl("https://claude.ai/new", url)}
                rel="noreferrer"
                target="_blank"
              />
            }
          >
            Open in Claude
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
