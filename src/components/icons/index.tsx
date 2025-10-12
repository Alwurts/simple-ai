import { JsonIcon } from "./json-icon";
import { CssIcon } from "./css-icon";
import { TsIcon } from "./ts-icon";
import { FileIcon } from "lucide-react";

export function getIconForLanguageExtension(language: string) {
	switch (language) {
		case "json":
			return <JsonIcon />;
		case "css":
			return <CssIcon className="fill-foreground" />;
		case "js":
		case "jsx":
		case "ts":
		case "tsx":
		case "typescript":
			return <TsIcon className="fill-foregro	und" />;
		default:
			return <FileIcon />;
	}
}
