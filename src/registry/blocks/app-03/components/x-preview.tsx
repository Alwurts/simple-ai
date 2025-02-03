"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { XProfile } from "@/registry/blocks/app-03/lib/x";
import type { DeepPartial } from "ai";
import {
	BookmarkIcon,
	Calendar,
	ChartNoAxesColumn,
	Heart,
	Link as LinkIcon,
	MapPin,
	MessageCircle,
	Repeat2,
	Share,
} from "lucide-react";
import type { ReactNode } from "react";

function DisplayLoader({
	value,
	isLoading,
	width,
	forceLoading = true,
}: {
	value?: string | number | ReactNode;
	width?: string;
	isLoading: boolean;
	forceLoading?: boolean;
}) {
	return (
		<>
			{isLoading && (value === undefined || forceLoading) ? (
				<Skeleton className={cn("h-4 w-10", width)} />
			) : isLoading || value !== undefined ? (
				value
			) : (
				"-"
			)}
		</>
	);
}

export function XPreview({
	profile,
	isLoading = false,
	generateDialog,
}: {
	profile: DeepPartial<XProfile>;
	isLoading?: boolean;
	generateDialog: ReactNode;
}) {
	return (
		<div className="bg-white dark:bg-black text-black dark:text-white">
			<div className="max-w-7xl mx-auto flex">
				<div className="flex w-full">
					<aside className="hidden lg:flex flex-col w-[275px] min-w-[275px] p-4 pr-6 sticky top-0 h-screen">
						<nav className="space-y-4">
							<div className="h-12 w-12 bg-gray-100 dark:bg-zinc-800 rounded-lg" />
							{[...Array(7)].map((_, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									key={i}
									className="h-8 bg-gray-100 dark:bg-zinc-800 rounded-lg"
								/>
							))}
							<div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg" />
						</nav>
					</aside>

					<main className="flex-1 min-h-screen border-x border-gray-200 dark:border-zinc-800">
						<div className="relative">
							<div className="relative h-48 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-r dark:from-zinc-800 dark:to-zinc-900 from-zinc-200 to-zinc-300" />
							</div>
							<div className="p-6">
								<div className="relative">
									<div className="absolute -top-[100px]">
										<Avatar className="h-36 w-36 border-4 border-white dark:border-black">
											<AvatarFallback>
												{profile.displayName?.[0]}
											</AvatarFallback>
										</Avatar>
									</div>
									<div className="flex justify-end mb-4">{generateDialog}</div>
									<div className="mt-6">
										<h4 className="font-bold text-xl mb-2">
											<DisplayLoader
												value={profile.displayName}
												isLoading={isLoading}
												width="w-20"
											/>
										</h4>
										<span className="flex items-center text-gray-500">
											@
											<DisplayLoader
												value={profile.username}
												isLoading={isLoading}
												width="w-10"
											/>
										</span>
										<p className="mt-4">
											<DisplayLoader
												value={profile.bio}
												isLoading={isLoading}
												forceLoading={false}
											/>
										</p>

										<div className="flex flex-wrap gap-x-4 mt-2 text-gray-500">
											<span className="flex items-center gap-1">
												<MapPin size={16} />
												World
											</span>

											<span className="flex items-center gap-1">
												<LinkIcon size={16} />
												<span className="inline text-[#1d9bf0] lowercase">
													<DisplayLoader
														value={
															profile.username
																? `${profile.username}.com`
																: undefined
														}
														width="w-24"
														isLoading={isLoading}
													/>
												</span>
											</span>

											<span className="flex items-center gap-1">
												<Calendar size={16} />
												<DisplayLoader
													value="Joined January 2025"
													isLoading={isLoading}
													width="w-20"
													forceLoading
												/>
											</span>
										</div>
										<div className="flex gap-4 mt-4">
											<span className="flex items-center gap-1">
												<strong>
													<DisplayLoader
														value={Math.floor(Math.random() * 1000)}
														isLoading={isLoading}
														forceLoading
													/>
												</strong>
												<span className="text-gray-500">Following</span>
											</span>
											<span className="flex items-center gap-1">
												<strong>
													<DisplayLoader
														value={Math.floor(Math.random() * 1000)}
														isLoading={isLoading}
														forceLoading
													/>
												</strong>
												<span className="text-gray-500">Followers</span>
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="border-b border-gray-200 dark:border-zinc-800">
								<div className="flex">
									{[
										{ id: "posts", label: "Posts" },
										{ id: "replies", label: "Replies" },
										{ id: "highlights", label: "Highlights" },
										{ id: "media", label: "Media" },
										{ id: "likes", label: "Likes" },
									].map((tab) => (
										<button
											type="button"
											key={tab.id}
											className={`flex-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 py-4 relative ${
												tab.id === "posts"
													? "font-bold text-black dark:text-white"
													: ""
											}`}
										>
											{tab.label}
											{tab.id === "posts" && (
												<div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1d9bf0]" />
											)}
										</button>
									))}
								</div>
							</div>

							<div className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="flex flex-col border-b border-gray-200 dark:border-zinc-800"
									>
										<div className="flex gap-4 p-4">
											<Avatar className="h-12 w-12">
												<AvatarFallback>
													{profile.displayName?.[0]}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-2">
													<span className="font-bold">
														<DisplayLoader
															value={profile.displayName}
															isLoading={isLoading}
															width="w-20"
														/>
													</span>
													<span className="flex items-center text-gray-500">
														@
														<DisplayLoader
															value={profile.username}
															isLoading={isLoading}
															width="w-10"
														/>
													</span>
													<span className="text-gray-500">{i * 10}h</span>
												</div>
												<p>
													<div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-2/3" />
												</p>
											</div>
										</div>
										<div className="p-4 flex justify-around gap-4">
											<span className="flex items-center gap-2">
												<MessageCircle size={18} />
												<span className="text-sm">
													<DisplayLoader
														value={Math.floor(Math.random() * 100)}
														isLoading={isLoading}
														forceLoading
														width="w-6"
													/>
												</span>
											</span>
											<span className="flex items-center gap-2">
												<Repeat2 size={18} />
												<span className="text-sm">
													<DisplayLoader
														value={Math.floor(Math.random() * 100)}
														isLoading={isLoading}
														forceLoading
														width="w-6"
													/>
												</span>
											</span>
											<span className="flex items-center gap-2">
												<Heart size={18} />
												<span className="text-sm">
													<DisplayLoader
														value={Math.floor(Math.random() * 100)}
														isLoading={isLoading}
														forceLoading
														width="w-6"
													/>
												</span>
											</span>
											<span className="flex items-center gap-2">
												<ChartNoAxesColumn size={18} />
												<span className="text-sm">
													<DisplayLoader
														value={Math.floor(Math.random() * 1000)}
														isLoading={isLoading}
														forceLoading
														width="w-6"
													/>
												</span>
											</span>
											<span className="flex items-center gap-4">
												<BookmarkIcon size={18} />
												<Share size={18} />
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</main>

					<aside className="hidden xl:flex flex-col w-[350px] min-w-[350px] p-4 sticky top-0 h-screen">
						<div className="space-y-4">
							<div className="h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg" />
							<div className="p-4 space-y-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">
								<div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded w-1/3" />
								{[...Array(3)].map((_, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<div key={i} className="flex items-center gap-3">
										<div className="h-10 w-10 bg-gray-200 dark:bg-zinc-700 rounded-full" />
										<div className="flex-1 space-y-2">
											<div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-2/3" />
											<div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
										</div>
									</div>
								))}
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
