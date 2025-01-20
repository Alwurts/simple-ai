import type { formSchema } from "@/registry/blocks/app-02/types/persona";
import type { z } from "zod";

export type BusinessExample = z.infer<typeof formSchema>;

export const EXAMPLE_BUSINESSES: BusinessExample[] = [
	{
		businessName: "EcoHarvest",
		industry: "Sustainability",
		targetAudience:
			"Environmentally conscious consumers aged 25-45, urban professionals who care about sustainable food production and want to reduce their carbon footprint through better food choices.",
		productDescription:
			"Smart indoor garden system that allows users to grow organic vegetables and herbs year-round. Features automated climate control, LED grow lights, and a companion app for plant monitoring and care guidance.",
	},
	{
		businessName: "MindfulMinutes",
		industry: "Healthcare",
		targetAudience:
			"Busy professionals aged 30-50 who struggle with stress management and work-life balance, particularly in high-pressure corporate environments.",
		productDescription:
			"AI-powered meditation and mindfulness app that provides personalized micro-meditation sessions and stress-reduction exercises that can be completed in under 5 minutes.",
	},
	{
		businessName: "SkillBridge",
		industry: "Education",
		targetAudience:
			"Career changers and professionals aged 25-40 looking to upskill or transition into tech careers, particularly those with limited time for traditional education.",
		productDescription:
			"Adaptive learning platform that creates personalized tech skill development paths, combining micro-learning, practical projects, and AI-driven mentorship to help users transition into tech careers.",
	},
	{
		businessName: "PetPal",
		industry: "Tech/SaaS",
		targetAudience:
			"Pet owners aged 25-55 who work full-time and want to ensure their pets receive proper care and attention while they're away.",
		productDescription:
			"Smart pet care management system combining IoT devices and AI to monitor, feed, and entertain pets while their owners are away, with real-time updates and emergency alerts.",
	},
	{
		businessName: "LocalFeast",
		industry: "E-commerce",
		targetAudience:
			"Food enthusiasts and busy professionals aged 25-45 who value authentic local cuisine but have limited time to discover and prepare traditional dishes.",
		productDescription:
			"Marketplace platform connecting local home chefs with food enthusiasts, enabling the purchase of authentic, home-cooked meals with transparent sourcing and dietary information.",
	},
	{
		businessName: "SeniorTech",
		industry: "Healthcare Technology",
		targetAudience:
			"Adults aged 65+ and their caregivers who want to maintain independence while ensuring safety and well-being in their homes.",
		productDescription:
			"Smart home monitoring system designed specifically for seniors, featuring fall detection, medication reminders, vital sign monitoring, and easy communication with family members and healthcare providers.",
	},
	{
		businessName: "KidsFinance",
		industry: "Financial Education",
		targetAudience:
			"Parents of children aged 8-16 who want to teach their kids financial literacy and money management skills in an engaging way.",
		productDescription:
			"Gamified financial education platform that teaches children about saving, investing, and responsible spending through interactive games, challenges, and a parent-controlled digital wallet.",
	},
	{
		businessName: "ArtisanConnect",
		industry: "Marketplace",
		targetAudience:
			"Art collectors and interior designers seeking unique, handcrafted items, as well as artisans looking to reach a global market while preserving traditional craftsmanship.",
		productDescription:
			"Digital marketplace platform that connects traditional artisans with global buyers, featuring AR visualization tools, authenticity verification, and direct artist-buyer communication.",
	},
	{
		businessName: "GreenTransit",
		industry: "Transportation",
		targetAudience:
			"Urban commuters aged 20-40 who prioritize environmental sustainability and seek efficient, eco-friendly transportation options.",
		productDescription:
			"Electric bike and scooter sharing platform with smart routing technology, carbon footprint tracking, and rewards program for sustainable transportation choices.",
	},
	{
		businessName: "FitnessFlex",
		industry: "Fitness Technology",
		targetAudience:
			"Fitness enthusiasts aged 20-60 with varying schedules and abilities who want personalized workout experiences that adapt to their lifestyle.",
		productDescription:
			"AI-powered fitness platform that creates adaptive workout programs combining home exercises, gym routines, and outdoor activities, with real-time form correction and progress tracking.",
	},
];

export function getRandomExample(): BusinessExample {
	const randomIndex = Math.floor(Math.random() * EXAMPLE_BUSINESSES.length);
	return EXAMPLE_BUSINESSES[randomIndex];
}
