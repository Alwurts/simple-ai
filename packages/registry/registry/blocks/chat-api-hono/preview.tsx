export default function ChatApiHonoPreview() {
  return (
    <p className="p-6 text-muted-foreground text-sm">
      Hono POST <code>/api/chat</code>. Add with{" "}
      <code>@simple-ai/chat-page</code>, mount the app, then point useChat at{" "}
      <code>/api/chat</code>.
    </p>
  );
}
