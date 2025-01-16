import { create } from "zustand";

interface Version {
	code: string;
	prompt: string;
	versionNumber: number;
	status: "generating" | "complete";
}

type ViewMode = "preview" | "code";

interface GenerationStore {
	versions: Version[];
	currentVersion: number;
	view: ViewMode;
	chatOpen: boolean;
	addVersion: (code: string, prompt: string) => void;
	setCurrentVersion: (versionNumber: number) => void;
	updateCurrentCode: (code: string) => void;
	updateStatus: (status: Version["status"]) => void;
	setView: (view: ViewMode) => void;
	setChatOpen: (open: boolean) => void;
}

export const useGenerationStore = create<GenerationStore>((set) => ({
	versions: [],
	currentVersion: -1,
	view: "preview",
	chatOpen: true,
	addVersion: (code, prompt) =>
		set((state) => {
			const newVersion: Version = {
				code,
				prompt,
				versionNumber: state.versions.length,
				status: "generating",
			};
			return {
				versions: [...state.versions, newVersion],
				currentVersion: newVersion.versionNumber,
			};
		}),
	setCurrentVersion: (versionNumber) => set({ currentVersion: versionNumber }),
	updateCurrentCode: (code) =>
		set((state) => {
			if (state.currentVersion === -1) {
				return state;
			}

			const updatedVersions = [...state.versions];
			updatedVersions[state.currentVersion] = {
				...updatedVersions[state.currentVersion],
				code,
			};

			return {
				versions: updatedVersions,
			};
		}),
	updateStatus: (status) =>
		set((state) => {
			if (state.currentVersion === -1) {
				return state;
			}

			const updatedVersions = [...state.versions];
			updatedVersions[state.currentVersion] = {
				...updatedVersions[state.currentVersion],
				status,
			};

			return {
				versions: updatedVersions,
			};
		}),
	setView: (view) => set({ view }),
	setChatOpen: (open) => set({ chatOpen: open }),
}));
