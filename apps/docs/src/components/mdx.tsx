import { cn } from "@workspace/ui/lib/utils";
import type { ComponentProps, ComponentType } from "react";
import { CodeBlock } from "@/components/code-block";
import { ComponentPreview } from "@/components/component-preview";
import { ComponentsList } from "@/components/components-list";

type MDXComponents = Record<string, ComponentType | undefined>;

function headingId(children: unknown) {
  return String(children ?? "")
    .replace(/ /g, "-")
    .replace(/['?]/g, "")
    .toLowerCase();
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    h1: ({ className, ...props }: ComponentProps<"h1">) => (
      <h1
        className={cn(
          "mt-2 scroll-m-28 font-bold text-3xl tracking-tight",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, children, id, ...props }: ComponentProps<"h2">) => (
      <h2
        className={cn(
          "mt-10 scroll-m-28 font-medium text-xl tracking-tight first:mt-0 lg:mt-16 [&+p]:mt-4",
          className
        )}
        id={id ?? headingId(children)}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ className, children, id, ...props }: ComponentProps<"h3">) => (
      <h3
        className={cn(
          "mt-12 scroll-m-28 font-medium text-lg tracking-tight [&+p]:mt-4",
          className
        )}
        id={id ?? headingId(children)}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ className, ...props }: ComponentProps<"h4">) => (
      <h4
        className={cn(
          "mt-8 scroll-m-28 font-medium text-base tracking-tight",
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: ComponentProps<"p">) => (
      <p
        className={cn("leading-relaxed [&:not(:first-child)]:mt-6", className)}
        {...props}
      />
    ),
    a: ({ className, ...props }: ComponentProps<"a">) => (
      <a
        className={cn("font-medium underline underline-offset-4", className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }: ComponentProps<"ul">) => (
      <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
    ),
    ol: ({ className, ...props }: ComponentProps<"ol">) => (
      <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
    ),
    li: ({ className, ...props }: ComponentProps<"li">) => (
      <li className={cn("mt-2", className)} {...props} />
    ),
    strong: ({ className, ...props }: ComponentProps<"strong">) => (
      <strong className={cn("font-medium", className)} {...props} />
    ),
    blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
      <blockquote
        className={cn("mt-6 border-l-2 pl-6 italic", className)}
        {...props}
      />
    ),
    hr: ({ className, ...props }: ComponentProps<"hr">) => (
      <hr className={cn("my-8 border-border", className)} {...props} />
    ),
    table: ({ className, ...props }: ComponentProps<"table">) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn("w-full", className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }: ComponentProps<"tr">) => (
      <tr className={cn("border-t even:bg-muted", className)} {...props} />
    ),
    th: ({ className, ...props }: ComponentProps<"th">) => (
      <th
        className={cn(
          "border px-4 py-2 text-left font-medium [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: ComponentProps<"td">) => (
      <td
        className={cn(
          "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    pre: CodeBlock,
    code: ({ className, ...props }: ComponentProps<"code">) => (
      <code className={cn("font-mono text-sm", className)} {...props} />
    ),
    ComponentPreview,
    ComponentsList,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
