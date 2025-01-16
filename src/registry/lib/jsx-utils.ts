export function matchJsxTag(code: string) {
	if (code.trim() === "") {
		return null;
	}

	// Matches JSX tags in three forms:
	// 1. <tag attr="value">  2. <tag />  3. </tag>
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

export function completeJsxTag(code: string) {
	const stack: string[] = [];
	let result = "";
	let currentPosition = 0;

	// Process all JSX tags in the input code
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

	// Add any remaining closing tags
	return (
		result +
		stack
			.reverse()
			.map((tag) => `</${tag}>`)
			.join("")
	);
}

export function extractJsxContent(code: string): string | null {
	// Regular expression to match the content inside the return statement
	const returnContentRegex = /return\s*\(\s*([\s\S]*?)(?=\s*\);|\s*$)/;

	// Execute the regex on the input string
	const match = code.match(returnContentRegex);

	// If a match is found, return the content inside the return statement
	if (match?.[1]) {
		return match[1].trim();
	}

	// If no match is found, return null
	return null;
}
