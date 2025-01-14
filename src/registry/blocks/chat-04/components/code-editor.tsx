import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import type { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
	code: string;
	setCode: Dispatch<SetStateAction<string>>;
	className?: string;
}

export function CodeEditor({ code, setCode, className }: CodeEditorProps) {
	return (
		<div className={cn("flex-1", className)}>
			<CodeMirror
				value={code}
				height="100%"
				extensions={[html()]}
				onChange={(value) => setCode(value)}
				theme="dark"
				className="h-full border rounded-md overflow-hidden"
			/>
		</div>
	);
}
