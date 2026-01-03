import { redirect } from "next/navigation";
import { createId } from "@/lib/utils";

export default function ChatPage() {
	const newChatId = createId("chat");
	return redirect(`/chat/${newChatId}`);
}
