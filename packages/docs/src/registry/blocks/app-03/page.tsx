"use client";

import { useCompletion } from "@ai-sdk/react";
import type { DeepPartial } from "ai";
import { useEffect, useState } from "react";
import type { z } from "zod";
import { ProfileGenerateDialog } from "@/registry/blocks/app-03/components/profile-generate-dialog";
import { Toolbar } from "@/registry/blocks/app-03/components/toolbar";
import { XPreview } from "@/registry/blocks/app-03/components/x-preview";
import type {
	profileGenerationSchema,
	XProfile,
} from "@/registry/blocks/app-03/lib/x";

export default function XProfileGenerator() {
	const [profile, setProfile] = useState<DeepPartial<XProfile>>({});

	const { isLoading, complete, completion } = useCompletion({
		api: "/api/ai/x-profile",
		onFinish: (_prompt, completion) => {
			setProfile(profile => ({
				...profile,
				bio: completion,
			}));
		},
		experimental_throttle: 90,
	});

	useEffect(() => {
		if (completion) {
			setProfile(profile => ({
				...profile,
				bio: completion,
			}));
		}
	}, [completion]);

	function onSubmit(values: z.infer<typeof profileGenerationSchema>) {
		setProfile({
			displayName: values.displayName,
			username: values.username,
		});
		complete(JSON.stringify(values));
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<Toolbar />
			<XPreview
				profile={profile}
				isLoading={isLoading}
				generateDialog={<ProfileGenerateDialog onSubmit={onSubmit} />}
			/>
		</div>
	);
}
