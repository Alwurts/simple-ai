"use client";

import { useFrame } from "@react-three/fiber";
import { Container, type VanillaContainer } from "@react-three/uikit";
import { ChevronDown } from "@react-three/uikit-lucide";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { VrButton } from "@/components/ui/vr-button";
import { useWorldTheme } from "@/components/ui/world-card";

const EDGE = 8;
const GUTTER = 8;
const THUMB = 4;
const THUMB_RADIUS = 2;

type ScrollerApi = {
  away: boolean;
  scrollToEnd: () => void;
};

const ScrollerContext = createContext<ScrollerApi | null>(null);

function atLiveEdge(node: VanillaContainer, y: number, threshold: number) {
  const maxY = node.maxScrollPosition.peek()[1] ?? 0;
  if (maxY <= 0) {
    return true;
  }
  return maxY - y <= threshold;
}

function stickToEnd(node: VanillaContainer) {
  const maxY = node.maxScrollPosition.peek()[1] ?? 0;
  const current = node.scrollPosition.peek();
  if (Math.abs(current[1] - maxY) <= 0.5) {
    return;
  }
  node.scrollPosition.value = [current[0], maxY];
  node.root.peek().requestRender?.();
}

export function VrMessageScroller({
  autoScroll = true,
  children,
  followKey,
  gap = 6,
  scrollEdgeThreshold = EDGE,
}: {
  autoScroll?: boolean;
  children?: ReactNode;
  followKey?: string | number;
  gap?: number;
  scrollEdgeThreshold?: number;
}) {
  const theme = useWorldTheme();
  const viewport = useRef<VanillaContainer | null>(null);
  const following = useRef(autoScroll);
  const awayRef = useRef(false);
  const autoScrollRef = useRef(autoScroll);
  const thresholdRef = useRef(scrollEdgeThreshold);
  const [away, setAway] = useState(false);

  autoScrollRef.current = autoScroll;
  thresholdRef.current = scrollEdgeThreshold;

  const setAwayIf = useCallback((next: boolean) => {
    if (awayRef.current === next) {
      return;
    }
    awayRef.current = next;
    setAway(next);
  }, []);

  const scrollToEnd = useCallback(() => {
    const node = viewport.current;
    following.current = true;
    if (node) {
      stickToEnd(node);
    }
    setAwayIf(false);
  }, [setAwayIf]);

  useLayoutEffect(() => {
    if (!autoScroll) {
      return;
    }
    following.current = true;
    const node = viewport.current;
    if (node) {
      stickToEnd(node);
    }
    setAwayIf(false);
  }, [autoScroll, followKey, setAwayIf]);

  useFrame(() => {
    const node = viewport.current;
    if (!node) {
      return;
    }
    const dragging = node.downPointerMap.size > 0;
    if (autoScrollRef.current && following.current && !dragging) {
      stickToEnd(node);
    }
    const y = node.scrollPosition.peek()[1];
    const edge = atLiveEdge(node, y, thresholdRef.current);
    if (dragging) {
      return;
    }
    if (autoScrollRef.current && edge) {
      following.current = true;
    }
    const maxY = node.maxScrollPosition.peek()[1] ?? 0;
    setAwayIf(!edge && maxY > 0);
  });

  const onScroll = useCallback(
    (...args: number[]) => {
      const node = viewport.current;
      const y = args[1];
      if (!node || y === undefined) {
        return;
      }
      const edge = atLiveEdge(node, y, thresholdRef.current);
      if (autoScrollRef.current) {
        following.current = edge;
      }
      const maxY = node.maxScrollPosition.peek()[1] ?? 0;
      setAwayIf(!edge && maxY > 0);
    },
    [setAwayIf]
  );

  const value: ScrollerApi = { away, scrollToEnd };

  return (
    <ScrollerContext.Provider value={value}>
      <Container
        flexGrow={1}
        minHeight={0}
        overflow="hidden"
        positionType="relative"
        width="100%"
      >
        <Container
          flexDirection="column"
          flexGrow={1}
          gap={gap}
          height="100%"
          minHeight={0}
          onScroll={onScroll}
          overflow="scroll"
          paddingRight={GUTTER}
          ref={viewport}
          scrollbarBorderBottomLeftRadius={THUMB_RADIUS}
          scrollbarBorderBottomRightRadius={THUMB_RADIUS}
          scrollbarBorderTopLeftRadius={THUMB_RADIUS}
          scrollbarBorderTopRightRadius={THUMB_RADIUS}
          scrollbarColor={away ? theme.subtle : theme.card}
          scrollbarWidth={THUMB}
          width="100%"
        >
          {children}
        </Container>
        <VrMessageScrollerButton />
      </Container>
    </ScrollerContext.Provider>
  );
}

export function VrMessageScrollerButton() {
  const api = useContext(ScrollerContext);
  const theme = useWorldTheme();
  if (!api) {
    throw new Error(
      "VrMessageScrollerButton must be used under VrMessageScroller"
    );
  }
  if (!api.away) {
    return null;
  }
  return (
    <Container
      positionBottom={8}
      positionLeft="50%"
      positionType="absolute"
      transformTranslateX={-14}
      zIndex={2}
    >
      <VrButton height={28} onClick={api.scrollToEnd} width={28}>
        <ChevronDown color={theme.text} height={14} width={14} />
      </VrButton>
    </Container>
  );
}
