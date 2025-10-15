"use client";

import { Extension } from "@tiptap/core";
import { Mention as MentionExtension } from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor, JSONContent } from "@tiptap/react";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { SuggestionProps } from "@tiptap/suggestion";
import { ArrowUpIcon } from "lucide-react";
import {
	type ComponentProps,
	forwardRef,
	type ReactNode,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import tippy, { type Instance } from "tippy.js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupButton } from "./input-group";

export type ChatInputValue = JSONContent; // Store full JSON for state

// Base mention item that all custom mention types must extend
export type BaseMentionItem = {
	id: string;
	name: string;
};

// Generic mention config - allows typed items and renderItem
export type MentionConfig<T extends BaseMentionItem = BaseMentionItem> = {
	type: string; // Discriminator e.g., 'member' or 'file' (renamed from 'name')
	trigger: string; // e.g., '@' or '/'
	items: T[];
	renderItem?: (item: T, isSelected: boolean) => ReactNode;
	editorMentionClass?: string;
};

// Legacy type alias for backwards compatibility
export type MentionItem = BaseMentionItem;

// Helper for type inference - allows TypeScript to infer the generic type from items
export function createMentionConfig<T extends BaseMentionItem>(
	config: MentionConfig<T>,
): MentionConfig<T> {
	return config;
}

export type Mention = { type: string; id: string; name: string };

export function extractMentions(json: JSONContent): Mention[] {
	let mentions: Mention[] = [];
	if (json.content) {
		for (const item of json.content) {
			if (item.type?.endsWith("-mention")) {
				const type = item.type.replace("-mention", "");
				mentions.push({
					type,
					id: item.attrs?.id as string,
					name: item.attrs?.label as string,
				});
			}
			if (item.content) {
				mentions = mentions.concat(
					extractMentions({ type: item.type, content: item.content }),
				);
			}
		}
	}
	return mentions;
}

export interface ChatInputEditorProps {
	// biome-ignore lint/suspicious/noExplicitAny: Needs to accept configs with different item types
	mentionConfigs?: MentionConfig<any>[];
	disabled?: boolean;
	onEnter?: () => void;
	placeholder?: string;
	className?: string;
	value?: ChatInputValue; // Optional for controlled
	onChange?: (value: ChatInputValue) => void; // Optional
}

export function ChatInputEditor({
	mentionConfigs = [],
	disabled,
	onEnter,
	placeholder = "Type a message...",
	className,
	value,
	onChange,
}: ChatInputEditorProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const mentionConfigsRef = useRef(mentionConfigs);
	const onEnterRef = useRef(onEnter);

	useEffect(() => {
		mentionConfigsRef.current = mentionConfigs;
	}, [mentionConfigs]);

	useEffect(() => {
		onEnterRef.current = onEnter;
	}, [onEnter]);

	const extensions = [
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
	];

	const onUpdate = useCallback(
		({ editor }: { editor: Editor }) => {
			if (isMounted) {
				onChange?.(editor.getJSON());
			}
		},
		[onChange, isMounted],
	);

	const editor = useEditor({
		extensions,
		content: value,
		onUpdate,
		editable: !disabled,
		immediatelyRender: true,
	});

	// Sync external value
	useEffect(() => {
		if (
			value &&
			editor &&
			JSON.stringify(value) !== JSON.stringify(editor.getJSON())
		) {
			editor.commands.setContent(value, {});
		}
	}, [value, editor]);

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
					"w-full h-full max-h-48 p-4 overflow-y-auto",
					className,
				)}
			/>
		</>
	);
}

// Internal helpers

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

////////////////
// InputGroup //
////////////////

type ChatInputProps = ComponentProps<typeof InputGroup>;

export function ChatInput(props: ChatInputProps) {
	return <InputGroup {...props} />;
}

type ChatInputSubmitButtonProps = ComponentProps<typeof InputGroupButton>;

export function ChatInputSubmitButton(props: ChatInputSubmitButtonProps) {
	return (
		<InputGroupButton
			variant="default"
			size="icon-sm"
			className="rounded-full"
			{...props}
		>
			<ArrowUpIcon />
			<span className="sr-only">Send</span>
		</InputGroupButton>
	);
}
