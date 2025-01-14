import { create } from "zustand";

interface Version {
	code: string;
	versionNumber: number;
}

interface GenerationStore {
	versions: Version[];
	currentVersion: number;
	addVersion: (code: string) => void;
	setCurrentVersion: (versionNumber: number) => void;
}

export const useGenerationStore = create<GenerationStore>((set) => ({
	versions: [],
	currentVersion: -1,
	addVersion: (code) =>
		set((state) => {
			const newVersion = {
				code: code,
				versionNumber: state.versions.length,
			};
			return {
				versions: [...state.versions, newVersion],
				currentVersion: newVersion.versionNumber,
			};
		}),
	setCurrentVersion: (versionNumber) => set({ currentVersion: versionNumber }),
}));
