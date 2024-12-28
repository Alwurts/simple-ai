import {
	defineDocumentType,
	defineNestedType,
	makeSource,
} from "contentlayer2/source-files";
import { codeImport } from "remark-code-import";
import remarkGfm from "remark-gfm";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
	slug: {
		type: "string",
		resolve: (doc) => `/${doc._raw.flattenedPath}`,
	},
	slugAsParams: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
	},
};

const LinksProperties = defineNestedType(() => ({
	name: "LinksProperties",
	fields: {
		doc: {
			type: "string",
		},
		api: {
			type: "string",
		},
	},
}));

export const Doc = defineDocumentType(() => ({
	name: "Doc",
	filePathPattern: "docs/**/*.mdx",
	contentType: "mdx",
	fields: {
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
		published: {
			type: "boolean",
			default: true,
		},
		links: {
			type: "nested",
			of: LinksProperties,
		},
		featured: {
			type: "boolean",
			default: false,
			required: false,
		},
		component: {
			type: "boolean",
			default: false,
			required: false,
		},
		toc: {
			type: "boolean",
			default: true,
			required: false,
		},
	},
	computedFields,
}));

export default makeSource({
	contentDirPath: "./src/content",
	documentTypes: [Doc],
	mdx: {
		remarkPlugins: [remarkGfm, codeImport],
	},
});
