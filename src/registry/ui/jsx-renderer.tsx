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
import { completeJsxTag } from "@/registry/lib/jsx-utils";
import * as LucideIcons from "lucide-react";
import * as React from "react";
import JsxParser from "react-jsx-parser";

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
