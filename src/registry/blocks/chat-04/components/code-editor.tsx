import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cn } from "@/lib/utils";
import { useGenerationStore } from "../store";

interface CodeEditorProps {
	className?: string;
}

export function CodeEditor({ className }: CodeEditorProps) {
	const versions = useGenerationStore((state) => state.versions);
	const currentVersion = useGenerationStore((state) => state.currentVersion);
	const updateCurrentCode = useGenerationStore(
		(state) => state.updateCurrentCode,
	);

	const currentCode = versions[currentVersion]?.code ?? "";

	return (
		<div className={cn("flex-1", className)}>
			<CodeMirror
				value={currentCode}
				height="100%"
				extensions={[javascript({ jsx: true })]}
				onChange={updateCurrentCode}
				theme="dark"
				className="h-full border rounded-md overflow-hidden"
			/>
		</div>
	);
}
