"use client";

import { Versions } from "./components/versions";
import { EditorLayout } from "./components/editor-layout";

export default function Page() {
	return (
		<div className="flex w-screen h-screen justify-start">
			<Versions />
			<EditorLayout />
		</div>
	);
}
