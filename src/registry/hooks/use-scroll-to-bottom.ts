import { type RefObject, useEffect, useRef, useState } from "react";

export function useScrollToBottom<T extends HTMLElement>(): [
	RefObject<T>,
	RefObject<T>,
	boolean,
	() => void,
] {
	const containerRef = useRef<T>(null);
	const endRef = useRef<T>(null);
	const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [isTouching, setIsTouching] = useState(false);

	useEffect(() => {
		const container = containerRef.current;
		const end = endRef.current;

		if (container && end) {
			// Find the actual scrollable viewport element (Radix UI ScrollArea Viewport)
			const scrollViewport = container.closest(
				"[data-radix-scroll-area-viewport]",
			);

			if (!scrollViewport) {
				console.warn("ScrollArea viewport not found");
				return;
			}

			// Handle touch events
			const handleTouchStart = () => setIsTouching(true);
			const handleTouchEnd = () => setIsTouching(false);

			// Handle scroll events to determine if we should auto-scroll
			const handleScroll = () => {
				if (isTouching) {
					setShouldAutoScroll(false);
					return;
				}

				const { scrollTop, scrollHeight, clientHeight } = scrollViewport;
				const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
				// Use a hybrid approach: either within 30px of bottom OR 99.5% scrolled
				const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
				const isNearBottom =
					distanceFromBottom < 30 || scrollPercentage > 0.995;
				setShouldAutoScroll(isNearBottom);
				setShowScrollButton(!isNearBottom);
			};

			scrollViewport.addEventListener("scroll", handleScroll);
			scrollViewport.addEventListener("touchstart", handleTouchStart);
			scrollViewport.addEventListener("touchend", handleTouchEnd);

			const observer = new MutationObserver(() => {
				if (shouldAutoScroll && !isTouching) {
					end.scrollIntoView({ behavior: "instant", block: "end" });
				}
			});

			observer.observe(container, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true,
			});

			return () => {
				observer.disconnect();
				scrollViewport.removeEventListener("scroll", handleScroll);
				scrollViewport.removeEventListener("touchstart", handleTouchStart);
				scrollViewport.removeEventListener("touchend", handleTouchEnd);
			};
		}
	}, [shouldAutoScroll, isTouching]);

	const scrollToBottom = () => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
		setShouldAutoScroll(true);
	};

	return [containerRef, endRef, showScrollButton, scrollToBottom];
}
