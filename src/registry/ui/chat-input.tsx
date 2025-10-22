"use client";

import { Extension } from "@tiptap/core";
import { Mention as MentionExtension } from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor, JSONContent } from "@tiptap/react";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { SuggestionProps } from "@tiptap/suggestion";
import { ArrowUpIcon, Loader2 } from "lucide-react";

import {
	type ComponentProps,
	createContext,
	forwardRef,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import tippy, { type Instance } from "tippy.js";
import { Button } from "@/components/ui/button";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupText,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export type ChatInputValue = JSONContent;

export type BaseMentionItem = {
	id: string;
	name: string;
};

type MentionConfig<T extends BaseMentionItem = BaseMentionItem> = {
	type: string;
	trigger: string; // e.g., '@' or '/'
	items: T[];
	renderItem?: (item: T, isSelected: boolean) => ReactNode;
	editorMentionClass?: string;
};

export function createMentionConfig<T extends BaseMentionItem>(
	config: MentionConfig<T>,
): MentionConfig<T> {
	return config;
}

type ChatInputContextType = {
	// biome-ignore lint/suspicious/noExplicitAny: Needs to accept configs with different item types
	mentionConfigs: MentionConfig<any>[];
	// biome-ignore lint/suspicious/noExplicitAny: Needs to accept configs with different item types
	addMentionConfig: (config: MentionConfig<any>) => void;
	onSubmit: () => void;
	onStop?: () => void;
	isStreaming: boolean;
	disabled: boolean;
	value?: ChatInputValue;
	onChange?: (value: ChatInputValue) => void;
};

const ChatInputContext = createContext<ChatInputContextType>({
	mentionConfigs: [],
	addMentionConfig: () => {},
	onSubmit: () => {},
	onStop: undefined,
	isStreaming: false,
	disabled: false,
	value: undefined,
	onChange: undefined,
});

export function ChatInput({
	children,
	className,
	onSubmit,
	isStreaming = false,
	onStop,
	disabled = false,
	value,
	onChange,
	...props
}: ComponentProps<typeof InputGroup> & {
	onSubmit: () => void;
	isStreaming?: boolean;
	onStop?: () => void;
	disabled?: boolean;
	value?: ChatInputValue;
	onChange?: (value: ChatInputValue) => void;
}) {
	// biome-ignore lint/suspicious/noExplicitAny: Needs to accept configs with different item types
	const [mentionConfigs, setMentionConfigs] = useState<MentionConfig<any>[]>(
		[],
	);

	const registeredTypesRef = useRef(new Set<string>());

	// biome-ignore lint/suspicious/noExplicitAny: Needs to accept configs with different item types
	const addMentionConfig = useCallback((config: MentionConfig<any>) => {
		if (registeredTypesRef.current.has(config.type)) {
			setMentionConfigs((prev) => {
				const existingIndex = prev.findIndex(
					(c) => c.type === config.type,
				);
				if (existingIndex >= 0) {
					const updated = [...prev];
					updated[existingIndex] = config;
					return updated;
				}
				return prev;
			});
		} else {
			registeredTypesRef.current.add(config.type);
			setMentionConfigs((prev) => [...prev, config]);
		}
	}, []);

	return (
		<ChatInputContext.Provider
			value={{
				mentionConfigs,
				addMentionConfig,
				onSubmit,
				onStop,
				isStreaming,
				disabled,
				value,
				onChange,
			}}
		>
			<InputGroup
				className={cn(
					"focus-within:ring-1 focus-within:ring-ring rounded-2xl",
					className,
				)}
				{...props}
			>
				{children}
			</InputGroup>
		</ChatInputContext.Provider>
	);
}

export interface ChatInputEditorProps {
	disabled?: boolean;
	onEnter?: () => void;
	placeholder?: string;
	className?: string;
	value?: ChatInputValue;
	onChange?: (value: ChatInputValue) => void;
}

export function ChatInputEditor({
	disabled,
	onEnter,
	placeholder = "Type a message...",
	className,
	value,
	onChange,
}: ChatInputEditorProps) {
	const {
		mentionConfigs,
		onSubmit,
		disabled: contextDisabled,
		value: contextValue,
		onChange: contextOnChange,
	} = useContext(ChatInputContext);

	const effectiveValue = value ?? contextValue;
	const effectiveOnChange = onChange ?? contextOnChange;
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onEnterRef = useRef(onEnter || onSubmit);

	useEffect(() => {
		onEnterRef.current = onEnter || onSubmit;
	}, [onEnter, onSubmit]);

	const extensions = useMemo(
		() => [
			StarterKit,
			Placeholder.configure({ placeholder }),
			KeyboardShortcuts.configure({
				getOnEnter: () => onEnterRef.current,
			}),
			...mentionConfigs.map((config) => {
				const MentionPlugin = MentionExtension.extend({
					name: `${config.type}-mention`,
				});
				return MentionPlugin.configure({
					HTMLAttributes: {
						class: cn(
							"bg-primary text-primary-foreground rounded-sm px-1 py-0.5 no-underline",
							config.editorMentionClass,
						),
					},
					suggestion: {
						char: config.trigger,
						...getMentionSuggestion(config),
					},
				});
			}),
		],
		[mentionConfigs, placeholder],
	);

	const onUpdate = useCallback(
		({ editor }: { editor: Editor }) => {
			if (isMounted) {
				effectiveOnChange?.(editor.getJSON());
			}
		},
		[effectiveOnChange, isMounted],
	);

	const editor = useEditor(
		{
			extensions,
			content: effectiveValue,
			onUpdate,
			editable: !(disabled || contextDisabled),
			immediatelyRender: false,
		},
		[extensions, disabled, contextDisabled],
	);

	useEffect(() => {
		if (
			effectiveValue &&
			editor &&
			JSON.stringify(effectiveValue) !== JSON.stringify(editor.getJSON())
		) {
			editor.commands.setContent(effectiveValue);
		}
	}, [effectiveValue, editor]);

	return (
		<>
			<style>{`
				.tiptap:focus { outline: none; }
				.tiptap p.is-editor-empty:first-child::before {
					color: var(--muted-foreground);
					content: attr(data-placeholder);
					float: left;
					height: 0;
					pointer-events: none;
				}
			`}</style>
			<EditorContent
				editor={editor}
				className={cn(
					"w-full h-full max-h-48 px-4 pt-4 pb-2 overflow-y-auto",
					className,
				)}
			/>
		</>
	);
}

const KeyboardShortcuts = Extension.create({
	addKeyboardShortcuts() {
		return {
			Enter: () => {
				const onEnter = this.options.getOnEnter?.();
				if (onEnter) {
					onEnter();
				}
				return true;
			},
		};
	},
	addOptions() {
		return {
			getOnEnter: () => () => {},
		};
	},
});

export type ChatInputMentionProps<T extends BaseMentionItem = BaseMentionItem> =
	{
		type: string;
		trigger: string;
		items: T[];
		children?: (item: T, isSelected: boolean) => ReactNode;
		editorMentionClass?: string;
	};

export function ChatInputMention<T extends BaseMentionItem = BaseMentionItem>({
	type,
	trigger,
	items,
	children,
	editorMentionClass,
}: ChatInputMentionProps<T>) {
	const { addMentionConfig } = useContext(ChatInputContext);

	const renderItemRef = useRef(children);
	useEffect(() => {
		renderItemRef.current = children;
	}, [children]);

	useEffect(() => {
		addMentionConfig({
			type,
			trigger,
			items,
			renderItem: renderItemRef.current,
			editorMentionClass,
		});
	}, [addMentionConfig, type, trigger, items, editorMentionClass]);

	return null;
}

interface GenericMentionListProps<T extends BaseMentionItem> {
	items: T[];
	command: (item: { id: string; label: string }) => void;
	renderItem?: (item: T, isSelected: boolean) => ReactNode;
}

type GenericMentionListRef = {
	handleKeyDown: (event: KeyboardEvent) => boolean;
};

const GenericMentionList = forwardRef(
	<T extends BaseMentionItem>(
		props: GenericMentionListProps<T>,
		ref: React.Ref<GenericMentionListRef>,
	) => {
		const { items, command, renderItem } = props;
		const [selectedIndex, setSelectedIndex] = useState(0);
		const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

		const selectItem = useCallback(
			(index: number) => {
				const item = items[index];
				if (item) {
					command({
						id: item.id,
						label: item.name,
					});
				}
			},
			[items, command],
		);

		const scrollToItem = useCallback((index: number) => {
			const itemEl = itemRefs.current[index];
			if (itemEl) {
				itemEl.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
				});
			}
		}, []);

		const upHandler = useCallback(() => {
			setSelectedIndex((prevIndex) => {
				const newIndex = (prevIndex + items.length - 1) % items.length;
				scrollToItem(newIndex);
				return newIndex;
			});
		}, [items.length, scrollToItem]);

		const downHandler = useCallback(() => {
			setSelectedIndex((prevIndex) => {
				const newIndex = (prevIndex + 1) % items.length;
				scrollToItem(newIndex);
				return newIndex;
			});
		}, [items.length, scrollToItem]);

		const enterHandler = useCallback(() => {
			selectItem(selectedIndex);
		}, [selectedIndex, selectItem]);

		useEffect(() => {
			setSelectedIndex(0);
			itemRefs.current = itemRefs.current.slice(0, items.length);
		}, [items]);

		const handleKeyDown = useCallback(
			(event: KeyboardEvent) => {
				if (event.key === "ArrowUp") {
					upHandler();
					return true;
				}
				if (event.key === "ArrowDown") {
					downHandler();
					return true;
				}
				if (event.key === "Enter") {
					enterHandler();
					return true;
				}
				return false;
			},
			[upHandler, downHandler, enterHandler],
		);

		useImperativeHandle(ref, () => ({ handleKeyDown }), [handleKeyDown]);

		return (
			<div className="min-w-48 max-w-64 max-h-48 bg-popover text-popover-foreground border border-border rounded-lg shadow-md flex flex-col gap-1 overflow-y-auto p-1">
				{items.length ? (
					items.map((item, index) => (
						<Button
							key={item.id}
							variant="ghost"
							size="sm"
							className={cn(
								"flex justify-start px-1 py-2 gap-2",
								selectedIndex === index && "bg-accent",
							)}
							onClick={() => selectItem(index)}
							ref={(el) => {
								if (el) {
									itemRefs.current[index] = el;
								}
							}}
						>
							{renderItem ? (
								renderItem(item, selectedIndex === index)
							) : (
								<span className="px-2">{item.name}</span>
							)}
						</Button>
					))
				) : (
					<div className="text-sm text-muted-foreground px-2 py-1.5">
						No results found
					</div>
				)}
			</div>
		);
	},
);

function getMentionSuggestion<T extends BaseMentionItem>(
	config: MentionConfig<T>,
) {
	return {
		items: ({ query }: { query: string }) => {
			return config.items.filter((item) =>
				item.name.toLowerCase().startsWith(query.toLowerCase()),
			);
		},
		render: () => {
			// biome-ignore lint/suspicious/noExplicitAny: Ok
			let component: ReactRenderer<any>;
			let popup: Instance;

			return {
				onStart: (props: SuggestionProps<T>) => {
					component = new ReactRenderer(GenericMentionList, {
						props: {
							items: props.items,
							command: props.command,
							renderItem: config.renderItem,
						},
						editor: props.editor,
					});

					if (!props.clientRect) {
						return;
					}

					popup = tippy(document.body, {
						getReferenceClientRect:
							props.clientRect as () => DOMRect,
						appendTo: () => document.body,
						content: component.element,
						showOnCreate: true,
						interactive: true,
						trigger: "manual",
						placement: "bottom-start",
					});
				},
				onUpdate: (props: SuggestionProps<T>) => {
					component.updateProps(props);

					if (!props.clientRect) {
						return;
					}

					popup.setProps({
						getReferenceClientRect:
							props.clientRect as () => DOMRect,
					});
				},
				onKeyDown: (props: { event: KeyboardEvent }) => {
					if (props.event.key === "Escape") {
						popup.hide();
						return true;
					}
					return component.ref?.handleKeyDown?.(props.event) || false;
				},
				onExit: () => {
					popup.destroy();
					component.destroy();
				},
			};
		},
	};
}

export type ChatInputSubmitButtonProps = ComponentProps<
	typeof InputGroupButton
> & {
	isStreaming?: boolean;
	onStop?: () => void;
	disabled?: boolean;
};

export function ChatInputSubmitButton({
	className,
	isStreaming,
	onStop,
	disabled,
	...props
}: ChatInputSubmitButtonProps) {
	const {
		onSubmit,
		onStop: onStopContext,
		isStreaming: isStreamingContext,
		disabled: contextDisabled,
	} = useContext(ChatInputContext);

	const loading = isStreaming ?? isStreamingContext;
	const effectiveOnStop = onStop ?? onStopContext;
	const effectiveDisabled = disabled ?? contextDisabled;

	const isStopVariant = loading && effectiveOnStop;
	const isLoadingVariant = loading && !effectiveOnStop;

	const handleClick = isStopVariant ? effectiveOnStop : onSubmit;

	if (isStopVariant) {
		return (
			<InputGroupButton
				variant="default"
				size="icon-sm"
				className={cn("rounded-full", className)}
				onClick={handleClick}
				disabled={effectiveDisabled}
				{...props}
			>
				<StopIcon className="h-4 w-4" />

				<span className="sr-only">Stop</span>
			</InputGroupButton>
		);
	}

	if (isLoadingVariant) {
		return (
			<InputGroupButton
				variant="default"
				size="icon-sm"
				className={cn("rounded-full", className)}
				onClick={handleClick}
				disabled={effectiveDisabled}
				{...props}
			>
				<Loader2 className="h-4 w-4 animate-spin" />
				<span className="sr-only">Loading</span>
			</InputGroupButton>
		);
	}

	return (
		<InputGroupButton
			variant="default"
			size="icon-sm"
			className={cn("rounded-full", className)}
			onClick={handleClick}
			disabled={effectiveDisabled}
			{...props}
		>
			<ArrowUpIcon />
			<span className="sr-only">Send</span>
		</InputGroupButton>
	);
}

const StopIcon = ({ className }: { className?: string }) => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 16 16"
		fill="currentColor"
		className={className}
		aria-hidden="true"
	>
		<title>Stop</title>
		<rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" />
	</svg>
);

export type ChatInputGroupAddon = ComponentProps<typeof InputGroupAddon>;

export function ChatInputGroupAddon({
	className,
	...props
}: ChatInputGroupAddon) {
	return <InputGroupAddon className={cn(className)} {...props} />;
}

export type ChatInputGroupButtonProps = ComponentProps<typeof InputGroupButton>;
export function ChatInputGroupButton({
	className,
	...props
}: ChatInputGroupButtonProps) {
	return <InputGroupButton className={cn(className)} {...props} />;
}

export type ChatInputGroupTextProps = ComponentProps<typeof InputGroupText>;
export function ChatInputGroupText({
	className,
	...props
}: ChatInputGroupTextProps) {
	return <InputGroupText className={cn(className)} {...props} />;
}

// biome-ignore lint/suspicious/noExplicitAny: Required for type inference
type MentionConfigsObject = Record<string, MentionConfig<any>>;

type ParsedFromObject<T extends MentionConfigsObject> = {
	content: string;
} & {
	[K in keyof T]?: T[K] extends MentionConfig<infer Item> ? Item[] : never;
};

type ParsedContentOnly = {
	content: string;
};

type UseChatInputReturn<Mentions extends MentionConfigsObject | undefined> = {
	value: JSONContent;
	onChange: (value: JSONContent) => void;
	parsed: Mentions extends MentionConfigsObject
		? ParsedFromObject<Mentions>
		: ParsedContentOnly;
	clear: () => void;
	handleSubmit: () => void;
} & (Mentions extends MentionConfigsObject
	? { mentionConfigs: Mentions }
	: { mentionConfigs?: never });

export function useChatInput<Mentions extends MentionConfigsObject>(config: {
	mentions: Mentions;
	initialValue?: JSONContent;
	onSubmit?: (parsed: ParsedFromObject<Mentions>) => void;
}): UseChatInputReturn<Mentions>;

export function useChatInput(config: {
	mentions?: never;
	initialValue?: JSONContent;
	onSubmit?: (parsed: ParsedContentOnly) => void;
}): UseChatInputReturn<undefined>;

export function useChatInput<
	Mentions extends MentionConfigsObject | undefined,
>({
	mentions,
	initialValue,
	onSubmit: onCustomSubmit,
}: {
	mentions?: Mentions;
	initialValue?: JSONContent;
	// biome-ignore lint/suspicious/noExplicitAny: Required for generic config handling
	onSubmit?: (parsed: any) => void;
}): UseChatInputReturn<Mentions> {
	const [value, setValue] = useState<JSONContent>(
		initialValue ?? { type: "doc", content: [] },
	);

	const configsArray = useMemo(
		() => (mentions ? Object.values(mentions) : []),
		[mentions],
	);

	const parsed = useMemo(
		() => parseContent(value, configsArray),
		[value, configsArray],
	);

	const clear = useCallback(() => {
		setValue({ type: "doc", content: [] });
	}, []);

	const handleSubmit = useCallback(() => {
		if (parsed.content.trim().length === 0) {
			return;
		}

		if (onCustomSubmit) {
			onCustomSubmit(parsed);
		}

		clear();
	}, [parsed, onCustomSubmit, clear]);

	return {
		value,
		onChange: setValue,
		parsed,
		clear,
		handleSubmit,
		...(mentions ? { mentionConfigs: mentions } : {}),
		// biome-ignore lint/suspicious/noExplicitAny: Type inference complexity
	} as any;
}

// biome-ignore lint/suspicious/noExplicitAny: Required for type inference
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;

// biome-ignore lint/suspicious/noExplicitAny: Required for type inference
type ConfigToField<Config extends MentionConfig<any>> =
	Config extends MentionConfig<infer T>
		? { [K in Config["type"]]: T[] }
		: never;

export type ParsedChatInputValue<
	// biome-ignore lint/suspicious/noExplicitAny: Required for type inference
	Configs extends readonly MentionConfig<any>[],
> = { content: string } & Partial<
	UnionToIntersection<
		{ [I in keyof Configs]: ConfigToField<Configs[I]> }[number]
	>
>;

// biome-ignore lint/suspicious/noExplicitAny: Required for generic config handling
export function parseContent<Configs extends readonly MentionConfig<any>[]>(
	json: JSONContent,
	configs: Configs,
): ParsedChatInputValue<Configs> {
	let content = "";
	// biome-ignore lint/suspicious/noExplicitAny: Dynamic mention types
	const mentions: Record<string, any[]> = {};

	function recurse(node: JSONContent) {
		if (node.type === "text" && node.text) {
			content += node.text;
		} else if (node.type === "hardBreak") {
			content += "\n";
		} else if (node.type?.endsWith("-mention")) {
			const mentionType = node.type.slice(0, -8);
			const config = configs.find((c) => c.type === mentionType);
			if (config) {
				const attrs = node.attrs ?? {};
				const id = attrs.id as string;
				//const type = attrs.type as string;
				const label = attrs.label as string;
				content += `<span class="mention mention-${mentionType}" data-type="${mentionType}" data-id="${id}" data-name="${label}" >${config.trigger}${label}</span>`;

				if (!mentions[mentionType]) {
					mentions[mentionType] = [];
				}
				const item = config.items.find((i) => i.id === id);
				if (
					item &&
					!mentions[mentionType].some(
						(existing) => existing.id === id,
					)
				) {
					mentions[mentionType].push(item);
				}
			} else {
				content += node.text ?? "";
			}
		} else if (node.content) {
			for (const child of node.content) {
				recurse(child);
			}
			if (node.type === "paragraph") {
				content += "\n\n";
			}
		}
	}

	if (json.content) {
		for (const node of json.content) {
			recurse(node);
		}
	}

	content = content.trim();

	return { content, ...mentions } as ParsedChatInputValue<Configs>;
}
