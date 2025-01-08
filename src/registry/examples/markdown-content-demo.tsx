import { useState } from "react";
import { MarkdownContent } from "../ui/markdown-content";

export default function MarkdownContentDemo() {
	const [content] = useState(
		`# Markdown Example

This is a sample paragraph that demonstrates how markdown content can be rendered in your application. It shows various markdown elements working together.

## Features List

- Clean and simple syntax
- Support for headings and paragraphs
- Bullet point lists
- Easy to read and write
- Customizable styling`,
	);
	return (
		<div className="p-4 w-full h-full bg-muted border rounded-md">
			<MarkdownContent id="markdown-content-demo" content={content} />
		</div>
	);
}
