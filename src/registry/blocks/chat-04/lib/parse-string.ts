import { parse, serialize } from "parse5";

export function parseString(string: string) {
	const tree = parse(string);

	// Helper function to find element with id="root"
	// biome-ignore lint/suspicious/noExplicitAny: Parse 5 does not provide types
	function findRootElement(node: any): any | null {
		if (
			node.attrs?.find(
				(attr: { name: string; value: string }) =>
					attr.name === "id" && attr.value === "root",
			)
		) {
			return node;
		}

		if (node.childNodes) {
			for (const child of node.childNodes) {
				if (child.nodeName === "#text") {
					continue;
				}
				const result = findRootElement(child);
				if (result) {
					return result;
				}
			}
		}

		return null;
	}

	const rootElement = findRootElement(tree);
	if (!rootElement) {
		return string; // Return original string if no root element found
	}

	return serialize(rootElement);
}
