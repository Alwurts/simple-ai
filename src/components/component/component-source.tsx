import fs from "node:fs/promises";
import path from "node:path";
import { CodeCollapsibleWrapper } from "@/components/code/code-collapsible-wrapper";
import { CopyButton } from "@/components/general/copy-button";
import { getIconForLanguageExtension } from "@/components/icons";
import { highlightCode } from "@/lib/highlight-code";
import { getRegistryItem } from "@/lib/registry";
import { cn } from "@/lib/utils";

export async function ComponentSource({
	name,
	src,
	title,
	language,
	collapsible = true,
	className,
}: React.ComponentProps<"div"> & {
	name?: string;
	src?: string;
	title?: string;
	language?: string;
	collapsible?: boolean;
}) {
	if (!name && !src) {
		return null;
	}

	let code: string | undefined;

	if (name) {
		const item = await getRegistryItem(name);
		code = item?.files?.[0]?.content;
	}

	if (src) {
		const file = await fs.readFile(path.join(process.cwd(), src), "utf-8");
		code = file;
	}

	if (!code) {
		return null;
	}

	// Fix imports.
	// Replace @/registry/ with @/components/.
	// code = code.replaceAll("@/registry/", "@/components/")

	// Replace export default with export.
	// code = code.replaceAll("export default", "export")
	// code = code.replaceAll("/* eslint-disable react/no-children-prop */\n", "")

	const lang = language ?? title?.split(".").pop() ?? "tsx";
	const highlightedCode = await highlightCode(code, lang);

	if (!collapsible) {
		return (
			<div className={cn("relative", className)}>
				<ComponentCode
					code={code}
					highlightedCode={highlightedCode}
					language={lang}
					title={title}
				/>
			</div>
		);
	}

	return (
		<CodeCollapsibleWrapper className={className}>
			<ComponentCode
				code={code}
				highlightedCode={highlightedCode}
				language={lang}
				title={title}
			/>
		</CodeCollapsibleWrapper>
	);
}

function ComponentCode({
	code,
	highlightedCode,
	language,
	title,
}: {
	code: string;
	highlightedCode: string;
	language: string;
	title: string | undefined;
}) {
	return (
		<figure data-rehype-pretty-code-figure="" className="[&>pre]:max-h-96">
			{title && (
				<figcaption
					data-rehype-pretty-code-title=""
					className="text-code-foreground [&_svg]:text-code-foreground flex items-center gap-2 [&_svg]:size-4 [&_svg]:opacity-70"
					data-language={language}
				>
					{getIconForLanguageExtension(language)}
					{title}
				</figcaption>
			)}
			<CopyButton value={code} />
			<div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
		</figure>
	);
}
