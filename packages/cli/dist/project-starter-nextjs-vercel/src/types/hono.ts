import type { auth } from "@/lib/auth";

type Auth = typeof auth;

export type HonoContext = {
	Variables: {
		user: Auth["$Infer"]["Session"]["user"] | null;
		session: Auth["$Infer"]["Session"]["session"] | null;
	};
};

export type HonoContextWithAuth = HonoContext & {
	Variables: HonoContext["Variables"] & {
		user: NonNullable<HonoContext["Variables"]["user"]>;
		session: NonNullable<HonoContext["Variables"]["session"]>;
	};
};
