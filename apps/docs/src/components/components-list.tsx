import { components } from "@workspace/registry";

const DOCUMENTED = ["chat-input", "tool", "worked"] as const;
const VR = [
  "world-card",
  "vr-chat-input",
  "vr-tool",
  "vr-worked",
  "vr-reasoning",
  "vr-markdown",
] as const;

function ComponentLinks({ names }: { names: readonly string[] }) {
  const byName = new Map(
    components.map((component) => [component.name, component])
  );
  return (
    <div className="not-prose grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {names.map((name) => {
        const component = byName.get(name);
        if (!component) {
          return null;
        }
        return (
          <a
            className="inline-flex items-center gap-2 font-medium text-lg underline-offset-4 hover:underline md:text-base"
            href={`/docs/components/${component.name}`}
            key={component.name}
          >
            {component.title ?? component.name}
          </a>
        );
      })}
    </div>
  );
}

export function ComponentsList() {
  return (
    <div className="flex flex-col gap-10">
      <ComponentLinks names={DOCUMENTED} />
      <div className="flex flex-col gap-4">
        <h2 className="font-medium text-xl">VR</h2>
        <ComponentLinks names={VR} />
      </div>
    </div>
  );
}
