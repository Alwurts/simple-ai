import { FileCode } from "lucide-react";
import type * as React from "react";

export function getIconForLanguageExtension(ext: string): React.ReactNode {
	const iconMap: Record<string, React.ReactNode> = {
		tsx: <FileCode className="size-4" />,
		ts: <FileCode className="size-4" />,
		jsx: <FileCode className="size-4" />,
		js: <FileCode className="size-4" />,
		css: <FileCode className="size-4" />,
		json: <FileCode className="size-4" />,
	};

	return iconMap[ext] || <FileCode className="size-4" />;
}
