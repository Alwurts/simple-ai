export function HeroChatPreview() {
  return (
    <div className="relative mx-auto w-full" data-slot="hero-chat-preview">
      <div className="relative overflow-hidden rounded-xl border bg-background shadow-lg md:shadow-xl">
        <iframe
          className="block h-[32rem] w-full bg-background md:h-[34rem] lg:h-[40rem]"
          src="/view/chat-page?embed=1"
          title="Chat page preview"
        />
      </div>
    </div>
  );
}
