"use client";

import { useId, useState } from "react";
import { MarkdownContent } from "@/registry/ui/markdown-content";

export default function MarkdownContentDemo() {
	const [content] = useState(
		`# Markdown Example

This is a sample paragraph that demonstrates how markdown content can be rendered in your application. It shows various markdown elements working together.

## Features List

- Clean and simple syntax
- Support for headings and paragraphs
- Bullet point lists
- Easy to read and write
- Customizable styling

## Text Formatting

You can make text **bold**, *italic*, or ***both***. You can also use ~~strikethrough~~ text.

### Links and Images

Here's a [link to GitHub](https://github.com) and below is a sample image:

![Markdown Logo](https://markdown-here.com/img/icon256.png)

### Code Examples

Inline code: \`const greeting = "Hello World!"\`

#### Code Block	

\`\`\`javascript
// Code block
function sayHello() {
  console.log("Hello!");
}
\`\`\`

### Blockquotes

> This is a blockquote
> It can span multiple lines
>> And can be nested

### Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |

### Task Lists

- [x] Completed task
- [ ] Pending task
- [ ] Another task

### Horizontal Rule

---

### Ordered List

1. First item
2. Second item
3. Third item
   1. Sub-item 1
   2. Sub-item 2
`,
	);
	return (
		<div className="w-full max-h-[500px] overflow-y-auto">
			<MarkdownContent id={useId()} content={content} />
		</div>
	);
}
