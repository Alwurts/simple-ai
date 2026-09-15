import { components } from "@workspace/registry";

const DOCUMENTED = new Set(["chat-input", "tool", "worked"]);

export function ComponentsList() {
  return (
    <div className="not-prose grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {components
        .filter((component) => DOCUMENTED.has(component.name))
        .map((component) => (
          <a
            className="inline-flex items-center gap-2 font-medium text-lg underline-offset-4 hover:underline md:text-base"
            href={`/docs/components/${component.name}`}
            key={component.name}
          >
            {component.title ?? component.name}
          </a>
        ))}
    </div>
  );
}
