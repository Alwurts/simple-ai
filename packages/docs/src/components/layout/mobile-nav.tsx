"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { LogoIcon } from "@/components/icons/logo-icon";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/config";
import type { source } from "@/lib/source";
import { cn } from "@/lib/utils";

export function MobileNav({
	tree,
	items,
	className,
}: {
	tree: typeof source.pageTree;
	items: { href: string; label: string }[];
	className?: string;
}) {
	const [open, setOpen] = React.useState(false);
	const pathname = usePathname();

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					className={cn(
						"h-8 w-8 p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent",
						className,
					)}
				>
					<div className="relative flex h-3.5 w-4 flex-col justify-between">
						<span
							className={cn(
								"bg-foreground block h-0.5 w-full rounded-full transition-all duration-200",
								open
									? "translate-y-[6px] rotate-45"
									: "translate-y-0",
							)}
						/>
						<span
							className={cn(
								"bg-foreground block h-0.5 w-full rounded-full transition-all duration-200",
								open ? "opacity-0" : "opacity-100",
							)}
						/>
						<span
							className={cn(
								"bg-foreground block h-0.5 w-full rounded-full transition-all duration-200",
								open
									? "-translate-y-[6px] -rotate-45"
									: "translate-y-0",
							)}
						/>
					</div>
					<span className="sr-only">Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[300px] p-0 pr-0">
				<SheetHeader className="px-6 pt-8 pb-4 text-left">
					<SheetTitle asChild>
						<Link
							href="/"
							className="flex items-center gap-2 text-lg font-bold"
							onClick={() => setOpen(false)}
						>
							<LogoIcon className="size-6" />
							<span className="tracking-tight">
								{siteConfig.name}
							</span>
						</Link>
					</SheetTitle>
				</SheetHeader>
				<ScrollArea className="h-[calc(100vh-5rem)] pb-10 pl-6 pr-6">
					<div className="flex flex-col gap-8 pb-10">
						<div className="flex flex-col gap-2">
							<div className="text-foreground/70 px-2 text-xs font-bold uppercase tracking-wider mb-2">
								Menu
							</div>
							<div className="flex flex-col gap-1">
								<MobileLink
									href="/"
									onOpenChange={setOpen}
									isActive={pathname === "/"}
								>
									Home
								</MobileLink>
								{items.map((item) => (
									<MobileLink
										key={item.href}
										href={item.href}
										onOpenChange={setOpen}
										isActive={pathname === item.href}
									>
										{item.label}
									</MobileLink>
								))}
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<div className="text-foreground/70 px-2 text-xs font-bold uppercase tracking-wider mb-2">
								Sections
							</div>
							<div className="flex flex-col gap-1">
								{siteConfig.topLevelSections.map(
									({ name, href }) => {
										const isActive =
											href === "/docs"
												? pathname === href
												: pathname.startsWith(href);
										return (
											<MobileLink
												key={name}
												href={href}
												onOpenChange={setOpen}
												isActive={isActive}
											>
												{name}
											</MobileLink>
										);
									},
								)}
							</div>
						</div>
						<div className="flex flex-col gap-6">
							{tree?.children?.map((group) => {
								if (group.type === "folder") {
									return (
										<div
											key={group.$id}
											className="flex flex-col gap-2"
										>
											<div className="text-foreground/70 px-2 text-xs font-bold uppercase tracking-wider mb-2">
												{group.name}
											</div>
											<div className="flex flex-col gap-1">
												{group.children.map((item) => {
													if (item.type === "page") {
														return (
															<MobileLink
																key={item.url}
																href={item.url}
																onOpenChange={
																	setOpen
																}
																isActive={
																	pathname ===
																	item.url
																}
															>
																{item.name}
															</MobileLink>
														);
													}
													return null;
												})}
											</div>
										</div>
									);
								}
								return null;
							})}
						</div>
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}

interface MobileLinkProps extends LinkProps {
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
	isActive?: boolean;
}

function MobileLink({
	href,
	onOpenChange,
	className,
	children,
	isActive,
	...props
}: MobileLinkProps) {
	const router = useRouter();
	return (
		<Link
			href={href}
			onClick={() => {
				router.push(href.toString());
				onOpenChange?.(false);
			}}
			className={cn(
				"relative flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors",
				"text-muted-foreground hover:text-foreground hover:bg-accent/50",
				isActive &&
					"bg-brand/5 text-brand font-semibold hover:bg-brand/10 hover:text-brand",
				className,
			)}
			{...props}
		>
			{isActive && (
				<div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-brand" />
			)}
			{children}
		</Link>
	);
}
