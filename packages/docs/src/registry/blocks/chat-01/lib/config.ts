import { HomeIcon, SettingsIcon } from "lucide-react";

export const config: {
	mainRoutes: {
		path: string;
		matchExpression: RegExp;
		label: string;
		icon: React.ComponentType;
	}[];
} = {
	mainRoutes: [
		{
			path: "/",
			label: "Home",
			matchExpression: /^\/$/,
			icon: HomeIcon,
		},
		{
			path: "/settings",
			label: "Settings",
			matchExpression: /^\/settings$/,
			icon: SettingsIcon,
		},
	],
};
