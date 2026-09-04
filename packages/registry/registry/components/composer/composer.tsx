"use client";

import { Extension, mergeAttributes } from "@tiptap/core";
import { Mention as MentionExtension } from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor, JSONContent } from "@tiptap/react";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";
import type { ChatStatus } from "ai";
import {
  ArrowUpIcon,
  AtSignIcon,
  Loader2Icon,
  SquareIcon,
  XIcon,
} from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { InputGroup, InputGroupButton } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export interface BaseMentionItem {
  id: string;
  name: string;
}

export interface MentionConfig<T extends BaseMentionItem> {
  /** Fixed at mount — changing it later has no effect. */
  trigger: string;
  items: T[] | ((query: string) => T[] | Promise<T[]>);
  render?: (item: T, selected: boolean) => ReactNode;
  chipClassName?: string;
}

export type MentionConfigs = Record<string, MentionConfig<BaseMentionItem>>;

type SelectedMentionItems = Record<string, Map<string, BaseMentionItem>>;

// Mapped + intersection shape — cannot be an interface.
export type ComposerParsed<Items extends Record<string, BaseMentionItem>> = {
  text: string;
} & { [K in keyof Items]?: Items[K][] };

export interface ComposerHandle {
  clear: () => void;
  focus: () => void;
  getText: () => string;
  setText: (text: string) => void;
  insertText: (text: string) => void;
}

interface ComposerHelpers {
  clear: () => void;
  focus: () => void;
}

interface ComposerContextValue {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  submit: () => void;
  status?: ChatStatus;
  onStop?: () => void;
  disabled: boolean;
  defaultValue?: string;
  mentions: MentionConfigs | undefined;
  mentionsRef: RefObject<MentionConfigs | undefined>;
  selectedItemsRef: RefObject<SelectedMentionItems>;
}

function filterStaticItems<T extends BaseMentionItem>(
  items: T[],
  query: string
): T[] {
  const q = query.toLowerCase();
  return items.filter((item) => item.name.toLowerCase().startsWith(q));
}

function resolveMentionItems<T extends BaseMentionItem>(
  config: MentionConfig<T>,
  query: string
): T[] | Promise<T[]> {
  if (typeof config.items === "function") {
    return config.items(query);
  }
  return filterStaticItems(config.items, query);
}

function textToDoc(text: string): JSONContent {
  return {
    type: "doc",
    content: text.split("\n").map((line) => ({
      type: "paragraph",
      ...(line ? { content: [{ type: "text", text: line }] } : {}),
    })),
  };
}

interface MentionListHandle {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

interface MentionListProps<T extends BaseMentionItem> {
  items: T[];
  loading?: boolean;
  command: (item: { id: string; label: string }) => void;
  renderItem?: (item: T, selected: boolean) => ReactNode;
  onSelectItem?: (item: T) => void;
  ref?: React.Ref<MentionListHandle>;
}

function MentionList<T extends BaseMentionItem>({
  items,
  loading,
  command,
  renderItem,
  onSelectItem,
  ref,
}: MentionListProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevItems, setPrevItems] = useState(items);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (prevItems !== items) {
    setPrevItems(items);
    setSelectedIndex(0);
  }

  const selectItem = (index: number) => {
    const item = items[index];
    if (!item) {
      return;
    }
    onSelectItem?.(item);
    command({ id: item.id, label: item.name });
  };

  const moveSelection = (delta: number) => {
    setSelectedIndex((prev) => {
      const length = Math.max(items.length, 1);
      const next = (prev + delta + length) % length;
      itemRefs.current[next]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      return next;
    });
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        moveSelection(-1);
        return true;
      }
      if (event.key === "ArrowDown") {
        moveSelection(1);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (loading && items.length === 0) {
    return (
      <div className="min-w-48 rounded-md bg-popover px-2 py-1.5 text-muted-foreground text-sm shadow-md ring-1 ring-foreground/10">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex max-h-48 min-w-48 max-w-64 flex-col overflow-y-auto overflow-x-hidden rounded-md bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10">
      {items.length ? (
        items.map((item, index) => (
          <button
            className={cn(
              "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-hidden [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
              selectedIndex === index && "bg-accent text-accent-foreground"
            )}
            key={item.id}
            onClick={() => selectItem(index)}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
          >
            {renderItem ? (
              renderItem(item, selectedIndex === index)
            ) : (
              <span className="truncate">{item.name}</span>
            )}
          </button>
        ))
      ) : (
        <div className="px-2 py-1.5 text-muted-foreground text-sm">
          No results found
        </div>
      )}
    </div>
  );
}

function createMentionSuggestion(
  key: string,
  mentionsRef: RefObject<MentionConfigs | undefined>,
  selectedItemsRef: RefObject<SelectedMentionItems>
) {
  return {
    items: ({ query }: { query: string }) => {
      const config = mentionsRef.current?.[key];
      if (!config) {
        return [];
      }
      return resolveMentionItems(config, query);
    },
    render: () => {
      let component: ReactRenderer<MentionListHandle> | null = null;
      let unmount: (() => void) | undefined;

      const rememberItem = (item: BaseMentionItem) => {
        if (!selectedItemsRef.current[key]) {
          selectedItemsRef.current[key] = new Map();
        }
        selectedItemsRef.current[key].set(item.id, item);
      };

      return {
        onStart: (props: SuggestionProps<BaseMentionItem>) => {
          const config = mentionsRef.current?.[key];
          component = new ReactRenderer(MentionList, {
            props: {
              items: props.items,
              loading: props.loading,
              command: props.command,
              renderItem: config?.render,
              onSelectItem: rememberItem,
            },
            editor: props.editor,
          });
          // The mount wrapper is the positioned element (appended to body,
          // position:absolute, no z-index) — without this it stacks below
          // elevated surfaces like the z-50 chat dock.
          component.element.style.zIndex = "50";
          unmount = props.mount(component.element);
        },
        onUpdate: (props: SuggestionProps<BaseMentionItem>) => {
          const config = mentionsRef.current?.[key];
          component?.updateProps({
            items: props.items,
            loading: props.loading,
            command: props.command,
            renderItem: config?.render,
            onSelectItem: rememberItem,
          });
        },
        onKeyDown: (props: SuggestionKeyDownProps) => {
          if (props.event.key === "Escape") {
            unmount?.();
            unmount = undefined;
            return true;
          }
          return component?.ref?.onKeyDown(props) ?? false;
        },
        onExit: () => {
          unmount?.();
          unmount = undefined;
          component?.destroy();
          component = null;
        },
      };
    },
  };
}

function buildMentionExtensions(
  mentionsRef: RefObject<MentionConfigs | undefined>,
  selectedItemsRef: RefObject<SelectedMentionItems>,
  initialMentions: MentionConfigs | undefined
) {
  return Object.entries(initialMentions ?? {}).map(([key, config]) => {
    const trigger = config.trigger || "@";
    const MentionPlugin = MentionExtension.extend({
      name: `${key}-mention`,
      renderHTML({ node, HTMLAttributes }) {
        const chipClassName = mentionsRef.current?.[key]?.chipClassName;
        return [
          "span",
          mergeAttributes(HTMLAttributes, {
            class: cn(
              "rounded-sm bg-primary px-1 py-0.5 text-primary-foreground no-underline",
              chipClassName
            ),
          }),
          `${trigger}${node.attrs.label ?? node.attrs.id}`,
        ];
      },
    });

    return MentionPlugin.configure({
      suggestion: {
        char: trigger,
        ...createMentionSuggestion(key, mentionsRef, selectedItemsRef),
      },
    });
  });
}

function appendMentionFromNode(
  node: JSONContent,
  mentions: MentionConfigs | undefined,
  selectedItems: SelectedMentionItems,
  buckets: Record<string, BaseMentionItem[]>
): string {
  const key = (node.type ?? "").slice(0, -"-mention".length);
  const config = mentions?.[key];
  const attrs = node.attrs ?? {};
  const id = String(attrs.id ?? "");
  const label = String(attrs.label ?? "");
  const trigger = config?.trigger ?? "";

  const cached = selectedItems[key]?.get(id);
  const item: BaseMentionItem = cached ?? { id, name: label };
  if (!buckets[key]) {
    buckets[key] = [];
  }
  if (!buckets[key].some((existing) => existing.id === id)) {
    buckets[key].push(item);
  }
  return `${trigger}${label}`;
}

export function parseEditorContent(
  json: JSONContent,
  mentions: MentionConfigs | undefined,
  selectedItems: SelectedMentionItems
) {
  let text = "";
  const buckets: Record<string, BaseMentionItem[]> = {};

  function recurse(node: JSONContent) {
    if (node.type === "text" && node.text) {
      text += node.text;
      return;
    }
    if (node.type === "hardBreak") {
      text += "\n";
      return;
    }
    if (node.type?.endsWith("-mention")) {
      text += appendMentionFromNode(node, mentions, selectedItems, buckets);
      return;
    }
    if (node.content) {
      for (const child of node.content) {
        recurse(child);
      }
      if (node.type === "paragraph") {
        text += "\n\n";
      }
    }
  }

  if (json.content) {
    for (const node of json.content) {
      recurse(node);
    }
  }

  return { text: text.trim(), ...buckets };
}

const ComposerContext = createContext<ComposerContextValue | null>(null);

function useComposerContext() {
  const ctx = useContext(ComposerContext);
  if (!ctx) {
    throw new Error("Composer components must be used within <Composer>");
  }
  return ctx;
}

type SharedComposerProps = {
  status?: ChatStatus;
  onStop?: () => void;
  disabled?: boolean;
  defaultValue?: string;
  className?: string;
  children: ReactNode;
  /** Imperative handle (clear/focus/getText/setText/insertText), not the DOM node. */
  ref?: Ref<ComposerHandle>;
} & Omit<
  ComponentProps<"div">,
  "children" | "onSubmit" | "defaultValue" | "ref"
>;

type ComposerPropsWithMentions<Items extends Record<string, BaseMentionItem>> =
  SharedComposerProps & {
    mentions: { [K in keyof Items]: MentionConfig<Items[K]> };
    onSubmit: (parsed: ComposerParsed<Items>, helpers: ComposerHelpers) => void;
  };

type ComposerPropsWithoutMentions = SharedComposerProps & {
  mentions?: undefined;
  onSubmit: (parsed: { text: string }, helpers: ComposerHelpers) => void;
};

export function Composer<Items extends Record<string, BaseMentionItem>>(
  props: ComposerPropsWithMentions<Items>
): React.JSX.Element;
export function Composer(
  props: ComposerPropsWithoutMentions
): React.JSX.Element;
export function Composer({
  mentions,
  onSubmit,
  status,
  onStop,
  disabled = false,
  defaultValue,
  className,
  children,
  ref,
  ...props
}: SharedComposerProps & {
  mentions?: MentionConfigs;
  // Runtime parse is untyped; overloads restore Items at the call site.
  // biome-ignore lint/suspicious/noExplicitAny: overload boundary
  onSubmit: (parsed: any, helpers: ComposerHelpers) => void;
}) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const mentionsRef = useRef(mentions);
  const onSubmitRef = useRef(onSubmit);
  const selectedItemsRef = useRef<SelectedMentionItems>({});

  mentionsRef.current = mentions;
  onSubmitRef.current = onSubmit;

  const parse = useCallback(() => {
    if (!editor) {
      return { text: "" };
    }
    return parseEditorContent(
      editor.getJSON(),
      mentionsRef.current,
      selectedItemsRef.current
    );
  }, [editor]);

  const clear = useCallback(() => {
    editor?.commands.clearContent(true);
    selectedItemsRef.current = {};
  }, [editor]);

  const focus = useCallback(() => {
    editor?.commands.focus("end");
  }, [editor]);

  const submit = useCallback(() => {
    if (disabled) {
      return;
    }
    const parsed = parse();
    editor?.commands.blur();
    onSubmitRef.current(parsed, { clear, focus });
  }, [clear, disabled, editor, focus, parse]);

  useImperativeHandle(
    ref,
    () => ({
      clear,
      focus,
      getText: () => parse().text,
      setText: (text) => {
        editor?.commands.setContent(textToDoc(text));
      },
      insertText: (text) => {
        editor?.chain().focus().insertContent(text).run();
      },
    }),
    [clear, editor, focus, parse]
  );

  const contextValue = useMemo<ComposerContextValue>(
    () => ({
      editor,
      setEditor,
      submit,
      status,
      onStop,
      disabled,
      defaultValue,
      mentions,
      mentionsRef,
      selectedItemsRef,
    }),
    [defaultValue, disabled, editor, mentions, onStop, status, submit]
  );

  return (
    <ComposerContext.Provider value={contextValue}>
      <InputGroup
        className={cn("h-auto", className)}
        data-slot="composer"
        {...props}
      >
        {children}
      </InputGroup>
    </ComposerContext.Provider>
  );
}

const SubmitEnter = Extension.create({
  name: "composerSubmitEnter",
  addOptions() {
    return {
      getOnEnter: (): (() => void) => () => undefined,
    };
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        this.options.getOnEnter()?.();
        return true;
      },
    };
  },
});

export function ComposerEditor({
  placeholder = "Type a message...",
  className,
  autoFocus,
}: {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  const {
    setEditor,
    submit,
    disabled,
    defaultValue,
    mentions,
    mentionsRef,
    selectedItemsRef,
  } = useComposerContext();

  const initialMentionsRef = useRef(mentions);
  const placeholderRef = useRef(placeholder);
  placeholderRef.current = placeholder;

  const onEnterRef = useRef(submit);
  onEnterRef.current = submit;

  // biome-ignore lint/correctness/useExhaustiveDependencies: editor built once; live config via refs
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      Placeholder.configure({
        placeholder: () => placeholderRef.current,
      }),
      SubmitEnter.configure({
        getOnEnter: () => onEnterRef.current,
      }),
      ...buildMentionExtensions(
        mentionsRef,
        selectedItemsRef,
        initialMentionsRef.current
      ),
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content: defaultValue ?? "",
    editable: !disabled,
    autofocus: autoFocus ? "end" : false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "data-slot": "input-group-control",
        class: cn(
          "tiptap max-w-none flex-1 rounded-none border-0 bg-transparent py-2 shadow-none outline-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent"
        ),
      },
    },
  });

  // biome-ignore lint/plugin/no-use-layout-effect: publish TipTap instance into Composer context before paint
  useLayoutEffect(() => {
    setEditor(editor);
    return () => setEditor(null);
  }, [editor, setEditor]);

  // biome-ignore lint/plugin/no-use-effect: TipTap setEditable when disabled prop changes after mount
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  return (
    <EditorContent
      className={cn(
        "max-h-48 min-h-16 w-full flex-1 overflow-y-auto px-3 py-0",
        "[&_.tiptap]:outline-none",
        "[&_.tiptap_p.is-editor-empty:first-child]:before:pointer-events-none",
        "[&_.tiptap_p.is-editor-empty:first-child]:before:float-left",
        "[&_.tiptap_p.is-editor-empty:first-child]:before:h-0",
        "[&_.tiptap_p.is-editor-empty:first-child]:before:text-muted-foreground",
        "[&_.tiptap_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]",
        className
      )}
      editor={editor}
    />
  );
}

export function ComposerSubmitButton({
  className,
  disabled,
  children,
  ...props
}: ComponentProps<typeof InputGroupButton>) {
  const {
    submit,
    status,
    onStop,
    disabled: contextDisabled,
  } = useComposerContext();

  const isInFlight = status === "submitted" || status === "streaming";
  const actAsStop = isInFlight && onStop !== undefined;

  let icon = <ArrowUpIcon className="size-4" />;
  if (actAsStop) {
    icon = <SquareIcon className="size-4" />;
  } else if (isInFlight) {
    icon = <Loader2Icon className="size-4 animate-spin" />;
  } else if (status === "error") {
    icon = <XIcon className="size-4" />;
  }

  return (
    <InputGroupButton
      aria-label={actAsStop ? "Stop" : "Send"}
      className={className}
      disabled={(disabled ?? contextDisabled) || (isInFlight && !actAsStop)}
      onClick={(event) => {
        event.preventDefault();
        if (actAsStop) {
          onStop();
        } else {
          submit();
        }
      }}
      size="icon-sm"
      type="button"
      variant="default"
      {...props}
    >
      {children ?? icon}
      <span className="sr-only">{actAsStop ? "Stop" : "Send"}</span>
    </InputGroupButton>
  );
}

export function ComposerMentionButton({
  trigger,
  className,
  children,
  ...props
}: ComponentProps<typeof InputGroupButton> & { trigger?: string }) {
  const { editor, mentions } = useComposerContext();

  const configs = mentions ? Object.values(mentions) : [];
  const resolvedTrigger = trigger ?? configs[0]?.trigger;
  if (!resolvedTrigger) {
    return null;
  }

  return (
    <InputGroupButton
      aria-label={`Insert ${resolvedTrigger}`}
      className={cn("shrink-0", className)}
      onClick={() => {
        editor?.chain().focus().insertContent(resolvedTrigger).run();
      }}
      size="icon-sm"
      type="button"
      variant="outline"
      {...props}
    >
      {children ?? <AtSignIcon className="size-4" />}
      <span className="sr-only">Insert {resolvedTrigger}</span>
    </InputGroupButton>
  );
}
