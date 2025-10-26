import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import "./condition-editor.css";
import type { Extension } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	type EditorView,
	ViewPlugin,
	type ViewUpdate,
} from "@codemirror/view";
import { tags } from "@lezer/highlight";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Code, Variable } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { VariableInfo } from "@/registry/blocks/workflow-01/lib/workflow/variables";
import { buildVariablePathSet } from "@/registry/blocks/workflow-01/lib/workflow/variables";

type ConditionEditorProps = {
	value: string;
	onChange: (value: string) => void;
	availableVariables: VariableInfo[];
	placeholder?: string;
};

const OPERATORS = [
	{ label: "==", description: "Equal to" },
	{ label: "!=", description: "Not equal to" },
	{ label: ">", description: "Greater than" },
	{ label: "<", description: "Less than" },
	{ label: ">=", description: "Greater than or equal" },
	{ label: "<=", description: "Less than or equal" },
	{ label: "&&", description: "And" },
	{ label: "||", description: "Or" },
	{ label: "!", description: "Not" },
	{ label: "in", description: "In array" },
	{ label: "matches", description: "Regex match" },
];

const jexlHighlightStyle = HighlightStyle.define([
	{ tag: tags.keyword, color: "#0550ae" },
	{ tag: tags.operator, color: "#953800" },
	{ tag: tags.number, color: "#0550ae" },
	{ tag: tags.string, color: "#0a3069" },
]);

function createJexlDecorations(
	view: EditorView,
	availableVariables: VariableInfo[],
): DecorationSet {
	const decorations: Array<{
		from: number;
		to: number;
		decoration: Decoration;
	}> = [];
	const text = view.state.doc.toString();

	const operatorRegex = /(==|!=|>=|<=|&&|\|\||[><!])/g;
	let match: RegExpExecArray | null = operatorRegex.exec(text);
	while (match !== null) {
		decorations.push({
			from: match.index,
			to: match.index + match[0].length,
			decoration: Decoration.mark({ class: "cm-jexl-operator" }),
		});
		match = operatorRegex.exec(text);
	}

	const keywordRegex = /\b(true|false|null|in|matches)\b/g;
	match = keywordRegex.exec(text);
	while (match !== null) {
		decorations.push({
			from: match.index,
			to: match.index + match[0].length,
			decoration: Decoration.mark({ class: "cm-jexl-keyword" }),
		});
		match = keywordRegex.exec(text);
	}

	const numberRegex = /\b\d+(\.\d+)?\b/g;
	match = numberRegex.exec(text);
	while (match !== null) {
		decorations.push({
			from: match.index,
			to: match.index + match[0].length,
			decoration: Decoration.mark({ class: "cm-jexl-number" }),
		});
		match = numberRegex.exec(text);
	}

	const stringRegex = /(['"])((?:\\.|(?!\1).)*?)\1/g;
	match = stringRegex.exec(text);
	while (match !== null) {
		decorations.push({
			from: match.index,
			to: match.index + match[0].length,
			decoration: Decoration.mark({ class: "cm-jexl-string" }),
		});
		match = stringRegex.exec(text);
	}

	const validPaths = buildVariablePathSet(availableVariables);

	const variablePathRegex =
		/\b[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*/g;
	match = variablePathRegex.exec(text);
	while (match !== null) {
		const matchedPath = match[0];
		if (validPaths.has(matchedPath)) {
			decorations.push({
				from: match.index,
				to: match.index + match[0].length,
				decoration: Decoration.mark({ class: "cm-jexl-variable" }),
			});
		}
		match = variablePathRegex.exec(text);
	}

	decorations.sort((a, b) => a.from - b.from);
	return Decoration.set(
		decorations.map((d) => d.decoration.range(d.from, d.to)),
	);
}

function createJexlHighlightPlugin(
	availableVariables: VariableInfo[],
): Extension {
	return ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = createJexlDecorations(
					view,
					availableVariables,
				);
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged) {
					this.decorations = createJexlDecorations(
						update.view,
						availableVariables,
					);
				}
			}
		},
		{
			decorations: (v) => v.decorations,
		},
	);
}

export function ConditionEditor({
	value,
	onChange,
	availableVariables,
	placeholder = "Enter condition expression",
}: ConditionEditorProps) {
	const { theme } = useTheme();
	const editorRef = React.useRef<ReactCodeMirrorRef>(null);

	const extensions = React.useMemo(() => {
		return [
			createJexlHighlightPlugin(availableVariables),
			syntaxHighlighting(jexlHighlightStyle),
		];
	}, [availableVariables]);

	const insertAtCursor = React.useCallback((text: string) => {
		if (editorRef.current?.view) {
			const view = editorRef.current.view;
			const { from, to } = view.state.selection.main;
			view.dispatch({
				changes: { from, to, insert: text },
				selection: { anchor: from + text.length },
			});
			view.focus();
		}
	}, []);

	const handleVariableClick = (variable: VariableInfo) => {
		insertAtCursor(variable.path);
	};

	const handleOperatorClick = (operator: string) => {
		insertAtCursor(` ${operator} `);
	};

	return (
		<div className="space-y-2">
			<div className="flex gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="gap-2"
						>
							<Variable className="w-3 h-3" />
							Variables
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80 p-0" align="start">
						<div className="max-h-[300px] overflow-y-auto">
							<div className="p-2 border-b bg-muted/50">
								<h4 className="text-xs font-semibold">
									Available Variables
								</h4>
							</div>
							{availableVariables.length === 0 ? (
								<div className="p-4 text-xs text-muted-foreground text-center">
									No variables available. Connect an input
									node first.
								</div>
							) : (
								<VariableList
									variables={availableVariables}
									onSelect={handleVariableClick}
								/>
							)}
						</div>
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="gap-2"
						>
							<Code className="w-3 h-3" />
							Operators
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-64 p-0" align="start">
						<div className="max-h-[300px] overflow-y-auto">
							<div className="p-2 border-b bg-muted/50">
								<h4 className="text-xs font-semibold">
									Common Operators
								</h4>
							</div>
							<div className="p-1">
								{OPERATORS.map((op) => (
									<button
										key={op.label}
										type="button"
										onClick={() =>
											handleOperatorClick(op.label)
										}
										className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-accent rounded-sm transition-colors"
									>
										<code className="font-mono font-semibold">
											{op.label}
										</code>
										<span className="text-muted-foreground">
											{op.description}
										</span>
									</button>
								))}
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			<div className="border rounded-md overflow-hidden jexl-editor">
				<CodeMirror
					value={value}
					onChange={onChange}
					extensions={extensions}
					basicSetup={{
						lineNumbers: false,
						foldGutter: false,
						highlightActiveLine: false,
						highlightActiveLineGutter: false,
					}}
					placeholder={placeholder}
					className="text-sm nodrag"
					height="60px"
					ref={editorRef}
					theme={theme === "dark" ? "dark" : "light"}
				/>
			</div>
		</div>
	);
}

function VariableList({
	variables,
	onSelect,
	level = 0,
}: {
	variables: VariableInfo[];
	onSelect: (variable: VariableInfo) => void;
	level?: number;
}) {
	return (
		<div className="p-1">
			{variables.map((variable) => (
				<div key={variable.path}>
					<button
						type="button"
						onClick={() => onSelect(variable)}
						className="w-full flex items-start gap-2 px-3 py-2 text-xs hover:bg-accent rounded-sm transition-colors"
						style={{ paddingLeft: `${8 + level * 16}px` }}
					>
						<div className="flex-1 text-left">
							<div className="font-mono font-semibold">
								{variable.path}
							</div>
							{variable.description && (
								<div className="text-muted-foreground mt-0.5">
									{variable.description}
								</div>
							)}
						</div>
						<span
							className={cn(
								"px-1.5 py-0.5 rounded text-[10px] font-medium",
								"bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
							)}
						>
							{variable.type}
						</span>
					</button>
					{variable.children && variable.children.length > 0 && (
						<VariableList
							variables={variable.children}
							onSelect={onSelect}
							level={level + 1}
						/>
					)}
				</div>
			))}
		</div>
	);
}
