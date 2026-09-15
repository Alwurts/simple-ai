export function DocsNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="font-medium text-sm">Page not found</p>
      <p className="max-w-md text-muted-foreground text-sm">
        This docs page does not exist or was moved. Try{" "}
        <a
          className="text-primary underline"
          href="/docs/components/chat-input"
        >
          chat input
        </a>{" "}
        or the{" "}
        <a className="text-primary underline" href="/blocks">
          chat page
        </a>
        .
      </p>
      <a className="text-primary text-sm underline" href="/docs">
        Back to docs home
      </a>
    </div>
  );
}

export function RootNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="font-medium text-sm">Page not found</p>
      <a className="text-primary text-sm underline" href="/docs">
        Go to docs
      </a>
    </div>
  );
}

export function BlockNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="font-medium text-sm">Block not found</p>
      <p className="text-muted-foreground text-sm">
        No block is registered under this name.
      </p>
      <a
        className="text-primary text-sm underline"
        href="/docs/components/chat-input"
      >
        Browse components
      </a>
    </div>
  );
}
