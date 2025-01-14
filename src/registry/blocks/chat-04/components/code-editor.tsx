import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { cn } from "@/lib/utils";
import { useGenerationStore } from "../store";

interface CodeEditorProps {
	className?: string;
}

export function CodeEditor({ className }: CodeEditorProps) {
	const { versions, currentVersion, addVersion } = useGenerationStore();
	const currentCode = versions[currentVersion]?.code ?? "";

	return (
		<div className={cn("flex-1", className)}>
			<CodeMirror
				value={currentCode}
				height="100%"
				extensions={[html()]}
				onChange={addVersion}
				theme="dark"
				className="h-full border rounded-md overflow-hidden"
			/>
		</div>
	);
}
