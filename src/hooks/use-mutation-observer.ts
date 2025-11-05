import * as React from "react";

export const useMutationObserver = (
	ref: React.RefObject<HTMLElement | null>,
	callback: MutationCallback,
	options: MutationObserverInit = {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
	},
) => {
	const callbackRef = React.useRef(callback);
	const optionsRef = React.useRef(options);

	// Keep refs updated without causing re-renders
	React.useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	React.useEffect(() => {
		optionsRef.current = options;
	}, [options]);

	React.useEffect(() => {
		const element = ref.current;
		if (!element) {
			return;
		}

		const observer = new MutationObserver((mutations, observerInstance) => {
			callbackRef.current(mutations, observerInstance);
		});

		observer.observe(element, optionsRef.current);
		return () => observer.disconnect();
		// Only re-run when the element reference changes
		// We can't use ref.current in deps, so we track the element itself
		// biome-ignore lint/correctness/useExhaustiveDependencies: ref.current is intentionally excluded
	}, [ref]);
};
