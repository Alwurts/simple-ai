export function idToReadableText(
	id: string,
	options?: { capitalize?: boolean },
): string {
	const { capitalize = true } = options || {};
	const readable = id
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/[_-]/g, " ")
		.toLowerCase();

	return capitalize
		? readable.replace(/\b\w/g, (l) => l.toUpperCase())
		: readable;
}
