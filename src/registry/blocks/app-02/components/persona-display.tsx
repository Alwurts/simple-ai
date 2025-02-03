import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
	ProductPersona,
	UserPersona,
} from "@/registry/blocks/app-02/lib/persona";
import type { DeepPartial } from "ai";

function DisplayField({
	label,
	value,
	isLoading,
	className,
}: {
	label: string;
	value?: string | number;
	isLoading: boolean;
	className?: string;
}) {
	return (
		<div className={cn("space-y-1", className)}>
			<p className="text-sm font-medium text-muted-foreground">{label}</p>
			{isLoading && value === undefined ? (
				<Skeleton className="h-4 w-full" />
			) : isLoading || value !== undefined ? (
				<p className="text-sm">{value}</p>
			) : (
				<p className="text-sm">-</p>
			)}
		</div>
	);
}

export function PersonaDisplay({
	object,
	isLoading,
}: {
	object?: {
		userPersona?: DeepPartial<UserPersona>;
		productPersona?: DeepPartial<ProductPersona>;
	};
	isLoading: boolean;
}) {
	const { userPersona, productPersona } = object || {};

	const getUserAvatar = (name?: string, gender?: string) => {
		if (!name || !gender) {
			return "";
		}
		const baseUrl = "https://avatar.iran.liara.run/public";
		return `${baseUrl}/${gender === "male" ? "boy" : "girl"}?username=${encodeURIComponent(name)}`;
	};

	return (
		<div className="flex flex-col">
			<DialogHeader className="mb-8">
				<DialogTitle className="text-2xl font-bold text-center">
					Here are your Generated Personas
				</DialogTitle>
			</DialogHeader>

			<div className="grid gap-8 md:grid-cols-2 h-full">
				<div className="flex flex-col space-y-3 h-full">
					<h4 className="text-xl font-semibold text-center flex-none">
						User Persona
					</h4>
					<Card className="flex-1 flex flex-col">
						<CardHeader className="flex flex-row items-center gap-4 flex-none">
							<Avatar className="h-16 w-16">
								<AvatarImage
									src={getUserAvatar(
										userPersona?.name,
										userPersona?.demographics?.gender,
									)}
									alt={userPersona?.name || "User"}
								/>
								<AvatarFallback>
									{userPersona?.name
										?.split(" ")
										.map((n) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div className="space-y-1">
								<CardTitle>{userPersona?.name || "User Persona"}</CardTitle>
								<p className="text-sm text-muted-foreground">
									{userPersona?.role || "Loading role..."}
								</p>
							</div>
						</CardHeader>
						<CardContent className="grid gap-4 flex-1">
							<div className="grid grid-cols-2 gap-4">
								<DisplayField
									label="Age"
									value={userPersona?.age}
									isLoading={isLoading}
								/>
								<DisplayField
									label="Location"
									value={userPersona?.demographics?.location}
									isLoading={isLoading}
								/>
								<DisplayField
									label="Gender"
									value={userPersona?.demographics?.gender}
									isLoading={isLoading}
								/>
								<DisplayField
									label="Education"
									value={userPersona?.demographics?.education}
									isLoading={isLoading}
								/>
							</div>
							<DisplayField
								label="Bio"
								value={userPersona?.bio}
								isLoading={isLoading}
								className="col-span-2"
							/>
							<div className="space-y-4">
								<DisplayField
									label="Goals"
									value={userPersona?.goals?.join("\n")}
									isLoading={isLoading}
								/>
								<DisplayField
									label="Frustrations"
									value={userPersona?.frustrations?.join("\n")}
									isLoading={isLoading}
								/>
								<DisplayField
									label="Preferred Channels"
									value={userPersona?.preferredChannels?.join(", ")}
									isLoading={isLoading}
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col space-y-3 h-full">
					<h4 className="text-xl font-semibold text-center flex-none">
						Product Persona
					</h4>
					<Card className="flex-1 flex flex-col">
						<CardHeader className="flex flex-row items-center gap-4 flex-none">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-4xl">
								{productPersona?.emoji || ""}
							</div>
							<div className="space-y-1">
								<CardTitle>
									{productPersona?.productName || "Product Persona"}
								</CardTitle>
								<p className="text-sm text-muted-foreground">
									{productPersona?.category || "Loading category..."}
								</p>
							</div>
						</CardHeader>
						<CardContent className="flex flex-col gap-4 flex-1">
							<div className="grid gap-4 content-start">
								<DisplayField
									label="Target Audience"
									value={productPersona?.targetAudience}
									isLoading={isLoading}
								/>
								<DisplayField
									label="Key Features"
									value={productPersona?.keyFeatures?.join("\n")}
									isLoading={isLoading}
								/>
								<DisplayField
									label="Value Proposition"
									value={productPersona?.valueProposition}
									isLoading={isLoading}
								/>
								<DisplayField
									label="Pain Points Solved"
									value={productPersona?.painPointsSolved?.join("\n")}
									isLoading={isLoading}
								/>
								<DisplayField
									label="Pricing Model"
									value={productPersona?.pricingModel}
									isLoading={isLoading}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
