import { Chat } from "@/registry/blocks/chat-01/components/chat";

export default function Page() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Chat />
			</div>
		</div>
	);
}
