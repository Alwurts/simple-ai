"use client";

import { Container, Text } from "@react-three/uikit";
import type { PhrasingContent, RootContent } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { gfm } from "micromark-extension-gfm";
import { type ReactNode, useMemo } from "react";
import { useWorldTheme, type WorldPalette } from "@/components/ui/world-card";

/** uikit's default Inter MSDF atlas is Latin + basic punctuation. Missing glyphs render as black squares. */
export function asciiSafe(value: string) {
  if (typeof value !== "string") {
    return "";
  }
  return value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[•‣∙·]/g, "-")
    .replace(/[✓✔✕]/g, "x")
    .replace(/[○◯●]/g, "o")
    .replace(/[▸►▶▹]/g, ">")
    .replace(/[▾▼▽]/g, "v")
    .replace(/\u2192/g, "->")
    .replace(/\u2190/g, "<-")
    .replace(/\u2194/g, "<->")
    .replace(/\u00b1/g, "+/-")
    .replace(/\u00b0/g, " deg")
    .replace(/\u00b5|\u03bc/g, "u")
    .replace(/\u00d7/g, "x")
    .replace(/\u00f7/g, "/")
    .replace(/\u2248/g, "~")
    .replace(/\u2264/g, "<=")
    .replace(/\u2265/g, ">=")
    .replace(/\u2260/g, "!=");
}

/** uikit Text drops leading/trailing regular spaces between sibling runs. */
function keepWrapSpaces(value: string) {
  return value.replace(/^ +| +$/g, (spaces) => "\u00a0".repeat(spaces.length));
}

type Weight = "medium" | "semi-bold";

function phrasing(
  nodes: PhrasingContent[],
  keyPrefix: string,
  palette: WorldPalette,
  base: { color?: string; size?: number; weight?: Weight } = {}
): ReactNode[] {
  const color = base.color ?? palette.text;
  const weight = base.weight ?? "medium";
  const size = base.size ?? 13;
  const out: ReactNode[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const key = `${keyPrefix}-${i}`;
    if (!node) {
      continue;
    }
    if (node.type === "text") {
      out.push(
        <Text color={color} fontSize={size} fontWeight={weight} key={key}>
          {keepWrapSpaces(asciiSafe(node.value))}
        </Text>
      );
      continue;
    }
    if (node.type === "break") {
      out.push(<Container height={4} key={key} width="100%" />);
      continue;
    }
    if (node.type === "strong") {
      out.push(
        ...phrasing(node.children, key, palette, {
          color,
          size,
          weight: "semi-bold",
        })
      );
      continue;
    }
    if (node.type === "emphasis") {
      out.push(
        ...phrasing(node.children, key, palette, {
          color: palette.subtle,
          size,
          weight,
        })
      );
      continue;
    }
    if (node.type === "inlineCode") {
      out.push(
        <Container
          backgroundColor={palette.muted}
          borderRadius={4}
          key={key}
          paddingX={3}
          paddingY={1}
        >
          <Text color={palette.text} fontSize={size - 1} fontWeight="medium">
            {asciiSafe(node.value)}
          </Text>
        </Container>
      );
      continue;
    }
    if (node.type === "link") {
      out.push(
        ...phrasing(node.children, key, palette, {
          color: palette.text,
          size,
          weight,
        })
      );
      continue;
    }
    if (node.type === "delete") {
      out.push(
        ...phrasing(node.children, key, palette, {
          color: palette.subtle,
          size,
          weight,
        })
      );
      continue;
    }
    const leftover = keepWrapSpaces(asciiSafe(plainNode(node)));
    if (leftover) {
      out.push(
        <Text color={color} fontSize={size} fontWeight={weight} key={key}>
          {leftover}
        </Text>
      );
    }
  }
  return out;
}

function Inline({
  nodes,
  size = 13,
  weight,
}: {
  nodes: PhrasingContent[];
  size?: number;
  weight?: Weight;
}) {
  const palette = useWorldTheme();
  return (
    <Container
      alignItems="center"
      flexDirection="row"
      flexWrap="wrap"
      gap={0}
      width="100%"
    >
      {phrasing(nodes, "p", palette, { size, weight })}
    </Container>
  );
}

function listMarker(
  ordered: boolean | null | undefined,
  start: number | null | undefined,
  index: number,
  checked: boolean | null | undefined
) {
  if (checked === true) {
    return "[x]";
  }
  if (checked === false) {
    return "[ ]";
  }
  if (ordered) {
    return `${(start ?? 1) + index}.`;
  }
  return "-";
}

function Block({ node }: { node: RootContent }) {
  const palette = useWorldTheme();
  if (node.type === "paragraph") {
    return <Inline nodes={node.children} />;
  }
  if (node.type === "heading") {
    const size = node.depth <= 1 ? 18 : node.depth === 2 ? 16 : 14;
    return <Inline nodes={node.children} size={size} weight="semi-bold" />;
  }
  if (node.type === "table") {
    return (
      <Container flexDirection="column" flexShrink={0} gap={0} width="100%">
        {node.children.map((row, rowIndex) => (
          <Container
            flexDirection="column"
            flexShrink={0}
            key={`row-${rowIndex}`}
            width="100%"
          >
            <Container flexDirection="row" gap={6} paddingY={4} width="100%">
              {row.children.map((cell, cellIndex) => (
                <Container
                  flexBasis={0}
                  flexGrow={1}
                  flexShrink={0}
                  key={`cell-${cellIndex}`}
                  minWidth={0}
                >
                  <Inline
                    nodes={cell.children}
                    size={12}
                    weight={rowIndex === 0 ? "semi-bold" : "medium"}
                  />
                </Container>
              ))}
            </Container>
            {rowIndex === 0 ? (
              <Container
                backgroundColor={palette.border}
                height={1}
                width="100%"
              />
            ) : null}
          </Container>
        ))}
      </Container>
    );
  }
  if (node.type === "code") {
    const lines = node.value.split("\n");
    return (
      <Container
        backgroundColor={palette.muted}
        borderRadius={8}
        flexDirection="column"
        gap={2}
        padding={8}
        width="100%"
      >
        {lines.map((line, lineIndex) => (
          <Text
            color={palette.text}
            fontSize={12}
            fontWeight="medium"
            key={`code-${lineIndex}`}
          >
            {line.length === 0 ? " " : asciiSafe(line)}
          </Text>
        ))}
      </Container>
    );
  }
  if (node.type === "list") {
    return (
      <Container flexDirection="column" gap={4} paddingLeft={4} width="100%">
        {node.children.map((item, itemIndex) => (
          <Container
            flexDirection="row"
            flexShrink={0}
            gap={6}
            key={`item-${itemIndex}`}
            width="100%"
          >
            <Text color={palette.text} fontSize={13} fontWeight="medium">
              {listMarker(node.ordered, node.start, itemIndex, item.checked)}
            </Text>
            <Container flexDirection="column" flexGrow={1} gap={4} minWidth={0}>
              {item.children.map((child, childIndex) => (
                <Block key={`child-${childIndex}`} node={child} />
              ))}
            </Container>
          </Container>
        ))}
      </Container>
    );
  }
  if (node.type === "blockquote") {
    return (
      <Container
        borderColor={palette.border}
        borderLeftWidth={2}
        flexDirection="column"
        gap={4}
        paddingLeft={8}
        width="100%"
      >
        {node.children.map((child, childIndex) => (
          <Block key={`quote-${childIndex}`} node={child} />
        ))}
      </Container>
    );
  }
  if (node.type === "thematicBreak") {
    return (
      <Container backgroundColor={palette.border} height={1} width="100%" />
    );
  }
  if (node.type === "html") {
    return (
      <Text color={palette.text} fontSize={13}>
        {asciiSafe(node.value)}
      </Text>
    );
  }
  return (
    <Text color={palette.text} fontSize={13}>
      {asciiSafe(plainNode(node))}
    </Text>
  );
}

function plainNode(node: RootContent | PhrasingContent): string {
  if ("value" in node && typeof node.value === "string") {
    return node.value;
  }
  if ("children" in node && Array.isArray(node.children)) {
    return node.children
      .map((child) => plainNode(child as PhrasingContent))
      .join("");
  }
  if ("alt" in node && typeof node.alt === "string") {
    return node.alt;
  }
  if ("url" in node && typeof node.url === "string") {
    return node.url;
  }
  return "";
}

export function VrMarkdown({ markdown }: { markdown: string }) {
  const palette = useWorldTheme();
  const tree = useMemo(() => {
    if (typeof markdown !== "string" || markdown.trim().length === 0) {
      return null;
    }
    try {
      return fromMarkdown(markdown, {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()],
      });
    } catch {
      return null;
    }
  }, [markdown]);

  if (typeof markdown !== "string" || !markdown.trim()) {
    return null;
  }
  if (!tree) {
    return (
      <Text color={palette.text} fontSize={13}>
        {asciiSafe(markdown)}
      </Text>
    );
  }

  return (
    <Container flexDirection="column" flexShrink={0} gap={8} width="100%">
      {tree.children.map((node, index) => (
        <Block key={`${node.type}-${index}`} node={node} />
      ))}
    </Container>
  );
}
