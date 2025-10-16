import { notFound } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

import { processMdxForLLMs } from "@/lib/llm";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ slug?: string[] | undefined }> },
) {
	const slug = (await params).slug;
	const page = source.getPage(slug);

	//const pageData = page?.data;
	//console.log("pageData", pageData.getText());

	// @ts-expect-error - revisit fumadocs types.
	console.log("page", page.data);
	console.log("slug", slug);
	// @ts-expect-error - revisit fumadocs types.
	console.log("content", page?.data.content);

	// @ts-expect-error - revisit fumadocs types.
	if (!page || !page.data.content) {
		notFound();
	}

	// @ts-expect-error - revisit fumadocs types.
	const processedContent = processMdxForLLMs(page.data.content);

	return new NextResponse(processedContent, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
		},
	});
}

export function generateStaticParams() {
	return source.generateParams();
}
