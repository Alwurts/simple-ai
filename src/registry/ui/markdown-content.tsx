import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

const components: Partial<Components> = {
	pre: ({ children }) => <>{children}</>,
	ol: ({ node, children, ...props }) => {
		return (
			<ol className="list-decimal list-outside ml-4" {...props}>
				{children}
			</ol>
		);
	},
	li: ({ node, children, ...props }) => {
		return (
			<li className="py-1" {...props}>
				{children}
			</li>
		);
	},
	ul: ({ node, children, ...props }) => {
		return (
			<ul className="list-decimal list-outside ml-4" {...props}>
				{children}
			</ul>
		);
	},
	strong: ({ node, children, ...props }) => {
		return (
			<span className="font-semibold" {...props}>
				{children}
			</span>
		);
	},
	a: ({ node, children, ...props }) => {
		return (
			<a
				className="text-blue-500 hover:underline"
				target="_blank"
				rel="noreferrer"
				{...props}
			>
				{children}
			</a>
		);
	},
	p: ({ node, children, ...props }) => {
		return (
			<p className="my-1" {...props}>
				{children}
			</p>
		);
	},
	h1: ({ node, children, ...props }) => {
		return (
			<h1 className="text-3xl font-semibold mt-4 mb-2" {...props}>
				{children}
			</h1>
		);
	},
	h2: ({ node, children, ...props }) => {
		return (
			<h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
				{children}
			</h2>
		);
	},
	h3: ({ node, children, ...props }) => {
		return (
			<h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
				{children}
			</h3>
		);
	},
	h4: ({ node, children, ...props }) => {
		return (
			<h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
				{children}
			</h4>
		);
	},
	h5: ({ node, children, ...props }) => {
		return (
			<h5 className="text-base font-semibold mt-6 mb-2" {...props}>
				{children}
			</h5>
		);
	},
	h6: ({ node, children, ...props }) => {
		return (
			<h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
				{children}
			</h6>
		);
	},
};

function parseMarkdownIntoBlocks(markdown: string): string[] {
	const tokens = marked.lexer(markdown);
	return tokens.map((token) => token.raw);
}

interface MarkdownBlockProps {
	content: string;
	className?: string;
}

const MemoizedMarkdownBlock = memo(
	({ content, className }: MarkdownBlockProps) => {
		return (
			<ReactMarkdown components={components} className={className}>
				{content}
			</ReactMarkdown>
		);
	},
	(prevProps, nextProps) => {
		if (prevProps.content !== nextProps.content) {
			return false;
		}
		return true;
	},
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

interface MarkdownContentProps {
	content: string;
	id: string;
	className?: string;
}

export const MarkdownContent = memo(
	({ content, id, className }: MarkdownContentProps) => {
		const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

		return blocks.map((block, index) => (
			<MemoizedMarkdownBlock
				content={block}
				className={className}
				key={`${id}-block_${
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					index
				}`}
			/>
		));
	},
);

MarkdownContent.displayName = "MarkdownContent";
