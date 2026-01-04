"use client";

import { History } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetAllChats } from "@/hooks/query/use-chat";

interface ChatHistoryContentProps {
	setOpen: (open: boolean) => void;
	onNavigate: (chatId: string) => void;
	currentChatId?: string;
}

function ChatHistoryContent({ setOpen, onNavigate, currentChatId }: ChatHistoryContentProps) {
	const { data: chats = [], isLoading } = useGetAllChats();

	const handleSelectChat = (chatId: string) => {
		onNavigate(chatId);
		setOpen(false);
	};

	return (
		<Command>
			<CommandInput placeholder="Search chats..." />
			<CommandList>
				{isLoading ? (
					<CommandEmpty>Loading chats...</CommandEmpty>
				) : chats.length === 0 ? (
					<CommandEmpty>No chats found</CommandEmpty>
				) : (
					<CommandGroup>
						{chats.map((chat) => (
							<CommandItem
								key={chat.id}
								value={chat.title}
								onSelect={() => handleSelectChat(chat.id)}
								className={currentChatId === chat.id ? "bg-accent" : ""}
							>
								<div className="flex flex-col gap-0.5">
									<span className="text-sm font-medium">{chat.title}</span>
									<span className="text-xs text-muted-foreground">
										{new Date(chat.createdAt).toLocaleDateString()}
									</span>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				)}
			</CommandList>
		</Command>
	);
}

interface ChatHistoryProps {
	onNavigate: (chatId: string) => void;
	currentChatId?: string;
}

export function ChatHistory({ onNavigate, currentChatId }: ChatHistoryProps) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon">
					<History />
					<span className="sr-only">Chat History</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-72 p-0" align="end">
				{open && (
					<ChatHistoryContent
						setOpen={setOpen}
						onNavigate={onNavigate}
						currentChatId={currentChatId}
					/>
				)}
			</PopoverContent>
		</Popover>
	);
}
