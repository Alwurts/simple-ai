import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

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
	const lastScrollTop = useRef(0);
	const smoothScrollTimeout = useRef<number>();

	const getViewport = useCallback((element: HTMLElement | null) => {
		return element?.closest("[data-radix-scroll-area-viewport]") as HTMLElement;
	}, []);

	const checkIfShouldShowButton = useCallback((viewport: HTMLElement) => {
		const { scrollTop, scrollHeight, clientHeight } = viewport;
		const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
		const hasScrollableContent = scrollHeight > clientHeight;

		setShowScrollButton(hasScrollableContent && !isAtBottom);
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		const viewport = getViewport(container);
		const end = endRef.current;

		if (container && viewport && end) {
			// Initial check for scroll button
			checkIfShouldShowButton(viewport);

			const handleScroll = () => {
				if (isManualScrolling.current || isTouching) {
					return;
				}

				const { scrollTop, scrollHeight, clientHeight } = viewport;
				
				// If scrolling up, disable auto-scroll
				if (scrollTop < lastScrollTop.current) {
					setShouldAutoScroll(false);
				}
				
				// If manually scrolled to bottom, re-enable auto-scroll
				const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
				if (isAtBottom) {
					setShouldAutoScroll(true);
				}
				
				lastScrollTop.current = scrollTop;
				checkIfShouldShowButton(viewport);
			};

			const handleTouchStart = () => {
				setIsTouching(true);
			};
			
			const handleTouchEnd = () => {
				setIsTouching(false);
			};

			// Content change observer
			const mutationObserver = new MutationObserver(() => {
				if (shouldAutoScroll && !isTouching) {
					isManualScrolling.current = true;
					viewport.scrollTo({
						top: viewport.scrollHeight,
						behavior: "instant",
					});
					requestAnimationFrame(() => {
						isManualScrolling.current = false;
						checkIfShouldShowButton(viewport);
					});
				} else {
					checkIfShouldShowButton(viewport);
				}
			});

			viewport.addEventListener("scroll", handleScroll, { passive: true });
			viewport.addEventListener("touchstart", handleTouchStart);
			viewport.addEventListener("touchend", handleTouchEnd);

			mutationObserver.observe(container, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true,
			});

			return () => {
				if (smoothScrollTimeout.current) {
					window.clearTimeout(smoothScrollTimeout.current);
				}
				mutationObserver.disconnect();
				viewport.removeEventListener("scroll", handleScroll);
				viewport.removeEventListener("touchstart", handleTouchStart);
				viewport.removeEventListener("touchend", handleTouchEnd);
			};
		}
	}, [shouldAutoScroll, isTouching, getViewport, checkIfShouldShowButton]);

	const scrollToBottom = () => {
		const container = containerRef.current;
		const viewport = getViewport(container);
		
		if (viewport) {
			// Clear any existing smooth scroll timeout
			if (smoothScrollTimeout.current) {
				window.clearTimeout(smoothScrollTimeout.current);
			}

			isManualScrolling.current = true;
			
			// Do the smooth scroll
			viewport.scrollTo({
				top: viewport.scrollHeight,
				behavior: "smooth",
			});

			// Wait for the smooth scroll to finish (approximately)
			// and then enable auto-scroll
			smoothScrollTimeout.current = window.setTimeout(() => {
				isManualScrolling.current = false;
				setShouldAutoScroll(true);
				setShowScrollButton(false);
			}, 500); // 500ms should be enough for most smooth scrolls
		}
	};

	return [containerRef, endRef, showScrollButton, scrollToBottom];
}
