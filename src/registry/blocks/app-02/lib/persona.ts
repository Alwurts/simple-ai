import { z } from "zod";

// Input form schema
export const formSchema = z.object({
	businessName: z.string().min(2, "Business name is required"),
	industry: z.string().min(2, "Industry is required"),
	targetAudience: z.string().min(10, "Please describe your target audience"),
	productDescription: z
		.string()
		.min(20, "Please provide more details about your product"),
});

// User Persona Schema
export const UserPersonaSchema = z.object({
	type: z.literal("user"),
	name: z.string().min(2).describe("Full name of the user"),
	age: z.number().int().positive().max(120),
	role: z.string().describe("Professional role or occupation"),
	demographics: z.object({
		location: z.string().describe("City and country"),
		gender: z.enum(["male", "female", "other"]),
		education: z.string().describe("Highest education level"),
	}),
	bio: z.string().describe("Short biographical description"),
	goals: z.array(z.string()).min(1).describe("User's primary goals"),
	frustrations: z
		.array(z.string())
		.min(1)
		.describe("User's main frustrations"),
	preferredChannels: z
		.array(z.string())
		.describe("Preferred communication channels"),
});

// Product Persona Schema
export const ProductPersonaSchema = z.object({
	type: z.literal("product"),
	productName: z.string().min(2),
	category: z.string().describe("Product category"),
	targetAudience: z.string().describe("Primary target users"),
	keyFeatures: z.array(z.string()).min(3),
	valueProposition: z.string().describe("Core value proposition"),
	painPointsSolved: z.array(z.string()).min(1),
	pricingModel: z.string().describe("e.g., Freemium, Subscription, etc."),
	emoji: z.string().min(1).max(1).describe("Category-representing emoji"),
});

// Type exports for TypeScript
export type UserPersona = z.infer<typeof UserPersonaSchema>;
export type ProductPersona = z.infer<typeof ProductPersonaSchema>;
