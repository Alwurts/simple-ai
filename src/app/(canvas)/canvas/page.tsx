"use client";

import Script from "next/script";
import { useEffect, useCallback, useState } from "react";
import JsxParser from "react-jsx-parser";
//import LucideIcon from "@/registry/blocks/chat-04/components/lucide-icon";
import * as LucideIcons from "lucide-react";
import {
	completeJsxTag,
	extractJsxContent,
} from "@/registry/blocks/chat-04/lib/complete-jsx-string";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Canvas() {
	const [code, setCode] = useState("");
	const handleMessageFromCanvasParent = useCallback((event: MessageEvent) => {
		const message = event.data;
		if (message.type === "CODE") {
			console.log("code", message.code);
			const extractedCode = extractJsxContent(message.code);
			if (extractedCode) {
				const completedCode = completeJsxTag(extractedCode);
				console.log("completedCode", completedCode);
				setCode(completedCode);
				return;
			}
			console.log("Could not extract code");
		}
	}, []);

	useEffect(() => {
		window.addEventListener("message", handleMessageFromCanvasParent);
		return () =>
			window.removeEventListener("message", handleMessageFromCanvasParent);
	}, [handleMessageFromCanvasParent]);

	const iconComponents = Object.keys(LucideIcons).reduce((acc, iconName) => {
		// Skip the default export
		if (iconName === "default") {
			return acc;
		}

		// Add each icon to the components object
		//@ts-ignore
		acc[iconName] = LucideIcons[iconName];
		return acc;
	}, {});

	// Add shadcn components to the components object
	const components = {
		...iconComponents,
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
	// Add react-error-boundary to handle errors in the code like v0 does with a sonner or toast
	return (
		<>
			<Script src="https://cdn.tailwindcss.com" />
			{/* @ts-ignore */}
			<JsxParser jsx={code} components={components} />
		</>
	);
}
