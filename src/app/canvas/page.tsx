"use client";

import * as LucideIcons from "lucide-react";
import Script from "next/script";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { extractJsxContent } from "@/registry/lib/jsx-utils";
import { JsxRenderer } from "@/registry/ui/jsx-renderer";

export default function Canvas() {
	const [code, setCode] = useState("");

	const handleMessageFromCanvasParent = useCallback((event: MessageEvent) => {
		const message = event.data;
		if (message.type === "CODE") {
			const jsx = extractJsxContent(message.code);
			if (jsx) {
				setCode(jsx);
			}
		}
	}, []);

	useEffect(() => {
		window.addEventListener("message", handleMessageFromCanvasParent);
		return () =>
			window.removeEventListener(
				"message",
				handleMessageFromCanvasParent,
			);
	}, [handleMessageFromCanvasParent]);

	const components = useMemo(() => {
		return {
			...LucideIcons,
			Button,
			Input,
			Label,
			Tabs,
			TabsContent,
			TabsList,
			TabsTrigger,
			Card,
			CardContent,
			CardDescription,
			CardFooter,
			CardHeader,
			CardTitle,
			Switch,
			Slider,
			Badge,
			Avatar,
			AvatarImage,
			AvatarFallback,
		};
	}, []);

	return (
		<>
			<Script src="https://cdn.tailwindcss.com" />
			{/* @ts-ignore */}
			<JsxRenderer jsx={code} components={components} />
		</>
	);
}
