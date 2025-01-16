/**
 * Matches and extracts information about JSX tags in a string of code.
 * Handles three tag formats:
 * 1. Opening tags: <tag attr="value">
 * 2. Self-closing tags: <tag />
 * 3. Closing tags: </tag>
 *
 * @param code - The string containing JSX code to analyze
 * @returns Object containing tag details or null if no match is found
 * @example
 * matchJsxTag('<div className="container">');
 * // Returns:
 * // {
 * //   tag: '<div className="container">',
 * //   tagName: 'div',
 * //   type: 'opening',
 * //   attributes: 'className="container"',
 * //   startIndex: 0,
 * //   endIndex: 27
 * // }
 */
export function matchJsxTag(code: string) {
	if (code.trim() === "") {
		return null;
	}

	const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\s*([^>]*?)(\/)?>/;
	const match = code.match(tagRegex);

	if (!match || typeof match.index === "undefined") {
		return null;
	}

	const [fullMatch, tagName, attributes, selfClosing] = match;
	const type = selfClosing
		? "self-closing"
		: fullMatch.startsWith("</")
			? "closing"
			: "opening";

	return {
		tag: fullMatch,
		tagName,
		type,
		attributes: attributes.trim(),
		startIndex: match.index,
		endIndex: match.index + fullMatch.length,
	};
}

/**
 * Completes any unclosed JSX tags in the provided code by adding their closing tags.
 * Maintains proper nesting order when adding closing tags.
 *
 * @param code - The JSX code string that may contain unclosed tags
 * @returns The completed JSX code with all necessary closing tags added
 * @example
 * completeJsxTag('<div><p);
 * // Returns: '<div></div>'
 */
export function completeJsxTag(code: string) {
	const stack: string[] = [];
	let result = "";
	let currentPosition = 0;

	while (currentPosition < code.length) {
		const match = matchJsxTag(code.slice(currentPosition));
		if (!match) {
			break;
		}

		const { tagName, type, endIndex } = match;

		if (type === "opening") {
			stack.push(tagName);
		} else if (type === "closing") {
			stack.pop();
		}

		result += code.slice(currentPosition, currentPosition + endIndex);
		currentPosition += endIndex;
	}

	return (
		result +
		stack
			.reverse()
			.map((tag) => `</${tag}>`)
			.join("")
	);
}

/**
 * Extracts JSX content from inside a return statement in the provided code.
 *
 * @param code - The code string containing a return statement with JSX
 * @returns The extracted JSX content as a string, or null if no content is found
 * @example
 * extractJsxContent('function Component() { return (<div>Hello</div>); }');
 * // Returns: '<div>Hello</div>'
 */
export function extractJsxContent(code: string): string | null {
	const returnContentRegex = /return\s*\(\s*([\s\S]*?)(?=\s*\);|\s*$)/;
	const match = code.match(returnContentRegex);

	if (match?.[1]) {
		return match[1].trim();
	}

	return null;
}
