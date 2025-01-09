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
	const isManualScrolling = useRef(false);

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

			// Check initial scroll position
			const checkScrollPosition = () => {
				if (isManualScrolling.current) {
					return;
				}
				
				const { scrollTop, scrollHeight, clientHeight } = scrollViewport;
				const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
				const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
				const isNearBottom =
					distanceFromBottom < 30 || scrollPercentage > 0.995;
				setShouldAutoScroll(isNearBottom);
				setShowScrollButton(!isNearBottom);
			};

			// Initial check
			checkScrollPosition();

			// Handle touch events
			const handleTouchStart = () => setIsTouching(true);
			const handleTouchEnd = () => setIsTouching(false);

			// Handle scroll events to determine if we should auto-scroll
			const handleScroll = () => {
				if (isTouching) {
					setShouldAutoScroll(false);
					return;
				}
				checkScrollPosition();
			};

			scrollViewport.addEventListener("scroll", handleScroll);
			scrollViewport.addEventListener("touchstart", handleTouchStart);
			scrollViewport.addEventListener("touchend", handleTouchEnd);

			const observer = new MutationObserver(() => {
				if (shouldAutoScroll && !isTouching) {
					const scrollViewport = container.closest(
						"[data-radix-scroll-area-viewport]",
					) as HTMLElement;
					
					if (scrollViewport) {
						isManualScrolling.current = true;
						scrollViewport.scrollTo({
							top: scrollViewport.scrollHeight,
							behavior: "instant"
						});
						requestAnimationFrame(() => {
							isManualScrolling.current = false;
							checkScrollPosition();
						});
					}
				} else {
					checkScrollPosition();
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
		const container = containerRef.current;
		if (container) {
			const scrollViewport = container.closest(
				"[data-radix-scroll-area-viewport]",
			) as HTMLElement;
			
			if (scrollViewport) {
				setShouldAutoScroll(true);
				setShowScrollButton(false);
				isManualScrolling.current = true;

				scrollViewport.scrollTo({
					top: scrollViewport.scrollHeight,
					behavior: "instant"
				});

				requestAnimationFrame(() => {
					isManualScrolling.current = false;
				});
			}
		}
	};

	return [containerRef, endRef, showScrollButton, scrollToBottom];
}
