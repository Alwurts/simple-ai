import { create } from "zustand";
import { persist } from "zustand/middleware";

type Config = {
	packageManager: "npm" | "yarn" | "pnpm" | "bun";
	installationType: "cli" | "manual";
};

const useConfigStore = create<
	Config & { setConfig: (config: Partial<Config>) => void }
>()(
	persist(
		set => ({
			packageManager: "pnpm",
			installationType: "cli",
			setConfig: config => set(state => ({ ...state, ...config })),
		}),
		{
			name: "config",
		},
	),
);

export function useConfig() {
	const { setConfig, ...config } = useConfigStore();
	return [config, setConfig] as const;
}
