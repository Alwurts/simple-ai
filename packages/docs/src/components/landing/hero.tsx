"use client";

import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Announcement } from "../general/announcement";

export function LandingHero() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}

		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect();
			setPosition({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
		};

		container.addEventListener("mousemove", handleMouseMove);
		return () =>
			container.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative flex md:min-h-[80vh] min-h-[65vh] flex-col items-center justify-center overflow-hidden border-b bg-background"
		>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
			<div
				className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--brand), transparent 40%)`,
					opacity: 0.15,
				}}
			/>

			<div className="relative z-10 container px-4 md:px-6">
				<div className="flex flex-col items-center text-center space-y-8">
					<Announcement size="lg" />
					<h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl text-balance">
						Build AI Agents <br className="hidden md:block" />
						<span className="text-muted-foreground">
							with shadcn
						</span>
					</h1>

					<p className="mx-auto max-w-[700px] text-muted-foreground text-lg sm:text-xl">
						An open-source library of AI-focused UI components, app
						blocks, and React Flow workflows designed to accelerate
						development. Built with shadcn/UI and Vercel AI SDK.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4 sm:px-0">
						<Button
							asChild
							size="lg"
							className="rounded-full text-base bg-brand hover:bg-brand/90 text-brand-foreground border-0"
						>
							<Link href="/docs/installation">
								Get Started{" "}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="rounded-full text-base"
						>
							<Link href="/blocks">
								<Terminal className="mr-2 h-4 w-4" />
								Browse Components
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
