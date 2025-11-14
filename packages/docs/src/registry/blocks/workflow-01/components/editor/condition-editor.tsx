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
import { Code, GitBranch, Variable } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type {
	TaggedVariableInfo,
	VariableInfo,
} from "@/registry/blocks/workflow-01/lib/workflow/context/variable-resolver";
import { buildVariablePathSet } from "@/registry/blocks/workflow-01/lib/workflow/context/variable-resolver";

type ConditionEditorProps = {
	value: string;
	onChange: (value: string) => void;
	availableVariables: VariableInfo[] | TaggedVariableInfo[];
	validationError?: string;
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
	{ label: "+", description: "Addition" },
	{ label: "-", description: "Subtraction" },
	{ label: "*", description: "Multiplication" },
	{ label: "/", description: "Division" },
	{ label: "%", description: "Modulo" },
	{ label: "in", description: "In array" },
	{ label: "matches", description: "Regex match" },
	{ label: "has", description: "Check if field exists" },
	{ label: "size", description: "Get size/length" },
	{ label: "?", description: "Ternary operator" },
	{ label: ":", description: "Ternary separator" },
];

const celHighlightStyle = HighlightStyle.define([
	{ tag: tags.keyword, color: "#0550ae" },
	{ tag: tags.operator, color: "#953800" },
	{ tag: tags.number, color: "#0550ae" },
	{ tag: tags.string, color: "#0a3069" },
]);

function createCelDecorations(
	view: EditorView,
	availableVariables: VariableInfo[],
): DecorationSet {
	const decorations: Array<{
		from: number;
		to: number;
		decoration: Decoration;
	}> = [];
	const text = view.state.doc.toString();

	// CEL operators: ==, !=, >=, <=, &&, ||, !, +, -, *, /, %, <, >, ?, :
	const operatorRegex = /(==|!=|>=|<=|&&|\|\||[+\-*/%><!?:])/g;
	let match: RegExpExecArray | null = operatorRegex.exec(text);
	while (match !== null) {
		decorations.push({
			from: match.index,
			to: match.index + match[0].length,
			decoration: Decoration.mark({ class: "cm-cel-operator" }),
		});
		match = operatorRegex.exec(text);
	}

	// CEL keywords: true, false, null, in, matches, has, size
	const keywordRegex = /\b(true|false|null|in|matches|has|size)\b/g;
	match = keywordRegex.exec(text);
	while (match !== null) {
		decorations.push({
			from: match.index,
			to: match.index + match[0].length,
			decoration: Decoration.mark({ class: "cm-cel-keyword" }),
		});
		match = keywordRegex.exec(text);
	}

	const numberRegex = /\b\d+(\.\d+)?\b/g;
	match = numberRegex.exec(text);
	while (match !== null) {
		decorations.push({
			from: match.index,
			to: match.index + match[0].length,
			decoration: Decoration.mark({ class: "cm-cel-number" }),
		});
		match = numberRegex.exec(text);
	}

	const stringRegex = /(['"])((?:\\.|(?!\1).)*?)\1/g;
	match = stringRegex.exec(text);
	while (match !== null) {
		decorations.push({
			from: match.index,
			to: match.index + match[0].length,
			decoration: Decoration.mark({ class: "cm-cel-string" }),
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
				decoration: Decoration.mark({ class: "cm-cel-variable" }),
			});
		}
		match = variablePathRegex.exec(text);
	}

	decorations.sort((a, b) => a.from - b.from);
	return Decoration.set(decorations.map(d => d.decoration.range(d.from, d.to)));
}

function createCelHighlightPlugin(
	availableVariables: VariableInfo[],
): Extension {
	return ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = createCelDecorations(view, availableVariables);
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged) {
					this.decorations = createCelDecorations(
						update.view,
						availableVariables,
					);
				}
			}
		},
		{
			decorations: v => v.decorations,
		},
	);
}

export function ConditionEditor({
	value,
	onChange,
	availableVariables,
	validationError,
	placeholder = "Enter condition expression",
}: ConditionEditorProps) {
	const { theme } = useTheme();
	const editorRef = React.useRef<ReactCodeMirrorRef>(null);

	// Convert to VariableInfo[] for highlighting (TaggedVariableInfo extends VariableInfo)
	const variablesForHighlighting: VariableInfo[] = availableVariables.map(
		v => ({
			path: v.path,
			type: v.type,
			description: v.description,
			children: v.children,
		}),
	);

	const extensions = React.useMemo(() => {
		return [
			createCelHighlightPlugin(variablesForHighlighting),
			syntaxHighlighting(celHighlightStyle),
		];
	}, [variablesForHighlighting]);

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
						<Button type="button" variant="outline" size="sm" className="gap-2">
							<Variable className="w-3 h-3" />
							Variables
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80 p-0" align="start">
						<div className="max-h-[300px] overflow-y-auto">
							<div className="p-2 border-b bg-muted/50">
								<h4 className="text-xs font-semibold">Available Variables</h4>
							</div>
							{availableVariables.length === 0 ? (
								<div className="p-4 text-xs text-muted-foreground text-center">
									No variables available. Connect an input node first.
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
						<Button type="button" variant="outline" size="sm" className="gap-2">
							<Code className="w-3 h-3" />
							Operators
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-64 p-0" align="start">
						<div className="max-h-[300px] overflow-y-auto">
							<div className="p-2 border-b bg-muted/50">
								<h4 className="text-xs font-semibold">Common Operators</h4>
							</div>
							<div className="p-1">
								{OPERATORS.map(op => (
									<button
										key={op.label}
										type="button"
										onClick={() => handleOperatorClick(op.label)}
										className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-accent rounded-sm transition-colors"
									>
										<code className="font-mono font-semibold">{op.label}</code>
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

			<div
				className={cn(
					"border rounded-md overflow-hidden cel-editor",
					validationError ? "border-red-500" : "",
				)}
			>
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
			{validationError && (
				<div className="text-xs text-red-600 dark:text-red-400 px-1">
					{validationError}
				</div>
			)}
		</div>
	);
}

function VariableList({
	variables,
	onSelect,
	level = 0,
}: {
	variables: VariableInfo[] | TaggedVariableInfo[];
	onSelect: (variable: VariableInfo) => void;
	level?: number;
}) {
	// Separate common and path-specific variables
	const commonVars: TaggedVariableInfo[] = [];
	const pathSpecificVars: TaggedVariableInfo[] = [];

	for (const variable of variables) {
		if ("tag" in variable && variable.tag === "path-specific") {
			pathSpecificVars.push(variable);
		} else {
			commonVars.push(variable as TaggedVariableInfo);
		}
	}

	return (
		<div className="p-1">
			{commonVars.length > 0 && (
				<>
					{level === 0 && (
						<div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase">
							Common Variables
						</div>
					)}
					{commonVars.map(variable => (
						<VariableItem
							key={variable.path}
							variable={variable}
							onSelect={onSelect}
							level={level}
						/>
					))}
				</>
			)}
			{pathSpecificVars.length > 0 && (
				<>
					{level === 0 && commonVars.length > 0 && (
						<div className="h-px bg-border my-1 mx-2" />
					)}
					{level === 0 && (
						<div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase">
							Path-Specific Variables
						</div>
					)}
					{pathSpecificVars.map(variable => (
						<VariableItem
							key={variable.path}
							variable={variable}
							onSelect={onSelect}
							level={level}
						/>
					))}
				</>
			)}
		</div>
	);
}

function VariableItem({
	variable,
	onSelect,
	level,
}: {
	variable: TaggedVariableInfo | VariableInfo;
	onSelect: (variable: VariableInfo) => void;
	level: number;
}) {
	const isPathSpecific = "tag" in variable && variable.tag === "path-specific";
	const sourceNodeIds =
		"sourceNodeIds" in variable ? variable.sourceNodeIds : [];

	const content = (
		<button
			type="button"
			onClick={() => onSelect(variable)}
			className={cn(
				"w-full flex items-start gap-2 px-3 py-2 text-xs hover:bg-accent rounded-sm transition-colors",
				isPathSpecific && "opacity-70",
			)}
			style={{ paddingLeft: `${8 + level * 16}px` }}
		>
			<div className="flex-1 text-left">
				<div className="flex items-center gap-1.5">
					<div className="font-mono font-semibold">{variable.path}</div>
					{isPathSpecific && (
						<GitBranch className="w-3 h-3 text-muted-foreground shrink-0" />
					)}
				</div>
				{variable.description && (
					<div className="text-muted-foreground mt-0.5">
						{variable.description}
					</div>
				)}
				{isPathSpecific && sourceNodeIds.length > 0 && (
					<div className="text-[10px] text-muted-foreground mt-0.5">
						From: {sourceNodeIds.length} source
						{sourceNodeIds.length > 1 ? "s" : ""}
					</div>
				)}
			</div>
			<span
				className={cn(
					"px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0",
					"bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
				)}
			>
				{variable.type}
			</span>
		</button>
	);

	if (isPathSpecific && sourceNodeIds.length > 0) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>{content}</TooltipTrigger>
					<TooltipContent>
						<p className="text-xs">
							Only available when input is from: {sourceNodeIds.join(", ")}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return <div key={variable.path}>{content}</div>;
}
