import PlausibleProvider from "next-plausible";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
	return (
		<PlausibleProvider domain="simple-ai.dev" selfHosted>
			{children}
		</PlausibleProvider>
	);
}
