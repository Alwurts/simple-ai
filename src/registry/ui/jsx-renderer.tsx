import * as React from "react";
import JsxParser from "react-jsx-parser";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { completeJsxTag } from "@/registry/blocks/chat-04/lib/complete-jsx-string";

interface JsxRendererProps extends React.HTMLAttributes<HTMLDivElement> {
	jsx: string;
	fixIncompleteJsx?: boolean;
}

const JsxRenderer = React.forwardRef<HTMLDivElement, JsxRendererProps>(
	({ className, jsx, fixIncompleteJsx = true }, ref) => {
		const processedJsx = React.useMemo(() => {
			return fixIncompleteJsx ? completeJsxTag(jsx) : jsx;
		}, [jsx, fixIncompleteJsx]);

		const iconComponents = Object.keys(LucideIcons).reduce((acc, iconName) => {
			if (iconName === "default") {
				return acc;
			}
			//@ts-ignore
			acc[iconName] = LucideIcons[iconName];
			return acc;
		}, {});

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

		return (
			/* @ts-ignore */
			<JsxParser
				ref={ref}
				className={className}
				jsx={processedJsx}
				components={components}
			/>
		);
	},
);
JsxRenderer.displayName = "JsxRenderer";

export { JsxRenderer };
