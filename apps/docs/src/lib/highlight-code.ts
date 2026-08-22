import { codeToHtml } from "shiki";

export async function highlightCode(code: string, language = "tsx") {
  return await codeToHtml(code, {
    lang: language,
    defaultColor: false,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
    transformers: [
      {
        pre(node) {
          node.properties.class =
            "no-scrollbar min-w-0 overflow-x-auto bg-transparent px-4 py-3.5 outline-none";
        },
      },
    ],
  });
}

export function languageFromPath(path: string) {
  const extension = path.split(".").pop()?.toLowerCase();
  if (extension === "ts") {
    return "typescript";
  }
  if (extension === "json") {
    return "json";
  }
  if (extension === "css") {
    return "css";
  }
  return "tsx";
}
