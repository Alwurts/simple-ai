import {
  type DocsCollection,
  defineDocs,
  type frontmatterSchema,
  type metaSchema,
} from "fumadocs-mdx/config";

export const docs: DocsCollection<typeof frontmatterSchema, typeof metaSchema> =
  defineDocs({
    dir: "content/docs",
    docs: {
      postprocess: {
        includeProcessedMarkdown: true,
      },
    },
  });
