import { z } from "zod";

export const XProfileSchema = z.object({
	displayName: z.string(),
	username: z.string(),
	bio: z.string().optional(),
	//website: z.string().url().optional(),
});

export type XProfile = z.infer<typeof XProfileSchema>;

export const profileGenerationSchema = z.object({
	displayName: z.string().min(1, "Display name is required"),
	username: z.string().min(1, "Username is required"),
	aboutYou: z.string().min(1, "Bio is required"),
	generationType: z.enum([
		"fun",
		"professional",
		"casual",
		"technical",
		"creative",
	]),
});
