import type { z } from "zod";

/**
 * A wrapper for Zod schemas that makes them "AI-friendly" by using nullable() and default(null)
 * instead of optional(). AI models often perform better with explicit null values.
 */
export const aiOptional = <T extends z.ZodTypeAny>(schema: T) => {
	return schema.nullable();
};
