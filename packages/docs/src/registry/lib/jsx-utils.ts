/**
 * Finds the closing bracket (>) of a JSX tag while properly handling:
 * - String literals (both single and double quotes)
 * - JSX expressions with braces {}
 * - Parentheses in arrow functions and function calls
 * - Arrow functions (=>)
 *
 * @param tagCode - The tag code starting from the opening <
 * @returns The index of the closing bracket, or -1 if not found
 */
function findTagClosingBracket(tagCode: string): number {
	let inString = false;
	let stringChar: string | null = null;
	let braceDepth = 0;
	let parenDepth = 0;

	for (let i = 1; i < tagCode.length; i++) {
		const char = tagCode[i];
		const prevChar = tagCode[i - 1];

		if (inString && prevChar === "\\") {
			continue;
		}

		if (char === '"' || char === "'") {
			if (!inString) {
				inString = true;
				stringChar = char;
			} else if (char === stringChar && prevChar !== "\\") {
				inString = false;
				stringChar = null;
			}
			continue;
		}

		if (!inString) {
			if (char === "{") {
				braceDepth++;
			} else if (char === "}") {
				braceDepth--;
			} else if (char === "(") {
				parenDepth++;
			} else if (char === ")") {
				parenDepth--;
			} else if (char === ">" && braceDepth === 0 && parenDepth === 0) {
				return i;
			}
		}
	}

	return -1;
}

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

	const tagStartMatch = code.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/);
	if (!tagStartMatch || typeof tagStartMatch.index === "undefined") {
		return null;
	}

	const tagName = tagStartMatch[1];
	const isClosingTag = tagStartMatch[0].startsWith("</");
	const startIndex = tagStartMatch.index;

	if (isClosingTag) {
		const closingBracketIndex = code.indexOf(">", startIndex);
		if (closingBracketIndex === -1) {
			return null;
		}

		return {
			tag: code.slice(startIndex, closingBracketIndex + 1),
			tagName,
			type: "closing",
			attributes: "",
			startIndex,
			endIndex: closingBracketIndex + 1,
		};
	}

	const tagContent = code.slice(startIndex);
	const closingBracketPos = findTagClosingBracket(tagContent);

	if (closingBracketPos === -1) {
		return null;
	}

	const fullMatch = tagContent.slice(0, closingBracketPos + 1);
	const isSelfClosing = fullMatch.endsWith("/>");

	const afterTagName = fullMatch.slice(tagName.length + 1);
	const attributes = isSelfClosing
		? afterTagName.slice(0, -2).trim()
		: afterTagName.slice(0, -1).trim();

	const type = isSelfClosing ? "self-closing" : "opening";

	return {
		tag: fullMatch,
		tagName,
		type,
		attributes,
		startIndex,
		endIndex: startIndex + closingBracketPos + 1,
	};
}

/**
 * Completes any unclosed JSX tags in the provided code by adding their closing tags.
 * Maintains proper nesting order when adding closing tags.
 *
 * @param code - The JSX code string that may contain unclosed tags
 * @returns The completed JSX code with all necessary closing tags added
 * @example
 * completeJsxTag('<div><p');
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
