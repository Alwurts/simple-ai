import { NextResponse } from "next/server";
import { processMdxForLLMs } from "@/lib/llm";
import { source } from "@/lib/source";

// cached forever
export const revalidate = false;

export async function GET() {
	const pages = source.getPages();
	const parsedPages = pages.map(async page => {
		const markdownTextRaw = await page.data.getText("raw");
		const processedContent = processMdxForLLMs(markdownTextRaw);
		return { url: page.url, text: processedContent };
	});
	const scanned = await Promise.all(parsedPages);

	let llmsText = "";
	for (const page of scanned) {
		llmsText += `# ${page.url}\n\n${page.text}\n\n`;
	}

	return new NextResponse(llmsText, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
}
