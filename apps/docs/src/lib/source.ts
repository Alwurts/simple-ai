import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";

const MD_SUFFIX_REGEX = /\.md$/;

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

export function markdownPathToSlugs(segs: string[]) {
  if (segs.length === 0) {
    return [];
  }

  const out = [...segs];
  const last = out.at(-1);
  if (last === undefined) {
    return out;
  }
  out[out.length - 1] = last.replace(MD_SUFFIX_REGEX, "");
  if (out.length === 1 && out[0] === "index") {
    out.pop();
  }
  return out;
}
