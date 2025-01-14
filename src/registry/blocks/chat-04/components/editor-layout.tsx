"use client";

import type { ImperativePanelHandle } from "react-resizable-panels";

import { Monitor, Smartphone, Tablet, Code, EyeIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Preview } from "./preview";
import { CodeEditor } from "./code-editor";

interface EditorLayoutProps {
	code: string;
	setCode: Dispatch<SetStateAction<string>>;
}

export function EditorLayout({ code, setCode }: EditorLayoutProps) {
	const viewerPanelRef = useRef<ImperativePanelHandle>(null);
	const [viewerSize, setViewerSize] = useState("100");

	const [view, setView] = useState<"preview" | "code">("preview");

	return (
		<div className="flex-1 relative py-3 pl-4 pr-1 flex flex-col gap-2 border-l border-border">
			<div className="h-10 flex items-center justify-start gap-4">
				<div className="flex items-center gap-1.5">
					<Code className="h-4 w-4" />
					<Switch
						checked={view === "code"}
						onCheckedChange={(checked) => setView(checked ? "code" : "preview")}
					/>
					<EyeIcon className="h-4 w-4" />
				</div>
				<Separator orientation="vertical" className="h-6" />
				{view === "preview" && (
					<ToggleGroup
						type="single"
						size="sm"
						defaultValue="100"
						value={viewerSize}
						onValueChange={(value) => {
							if (viewerPanelRef.current) {
								viewerPanelRef.current.resize(Number.parseInt(value));
								setViewerSize(value);
							}
						}}
						className="items-center gap-1.5 rounded-md border p-1 shadow-sm flex bg-background"
					>
						<ToggleGroupItem value="100" className="h-7 w-7 rounded-sm p-0">
							<Monitor className="h-3.5 w-3.5" />
						</ToggleGroupItem>
						<ToggleGroupItem value="60" className="h-7 w-7 rounded-sm p-0">
							<Tablet className="h-3.5 w-3.5" />
						</ToggleGroupItem>
						<ToggleGroupItem value="35" className="h-7 w-7 rounded-sm p-0">
							<Smartphone className="h-3.5 w-3.5" />
						</ToggleGroupItem>
					</ToggleGroup>
				)}
			</div>
			<Preview
				code={code}
				setViewerSize={setViewerSize}
				className={view === "preview" ? "block" : "hidden"}
				viewerPanelRef={viewerPanelRef}
			/>

			<CodeEditor
				code={code}
				setCode={setCode}
				className={view === "code" ? "block" : "hidden"}
			/>
		</div>
	);
}
