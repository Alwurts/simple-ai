import { tool } from "ai";
import z from "zod";

export const getProjectManagementResourcesTool = tool({
	name: "get-project-management-resources",
	description:
		"Get project management resources, methodologies, and best practices",
	inputSchema: z.object({
		topic: z
			.string()
			.describe("The specific project management topic to get resources for"),
	}),
	outputSchema: z.string(),
	execute: async ({ topic }) => {
		// Mock implementation
		if (topic.toLowerCase().includes("best practice")) {
			return "Resources found: Project Initiation (defining objectives, identifying stakeholders), Planning Phase (task breakdown, timelines, responsibilities), Execution (monitoring progress), and Closure (documentation, lessons learned).";
		}
		return `Found comprehensive resources on ${topic} including methodologies, frameworks, and real-world examples.`;
	},
});

export const getTaskBreakdownGuidanceTool = tool({
	name: "get-task-breakdown-guidance",
	description:
		"Get guidance on breaking down work into tasks using Work Breakdown Structure (WBS) and task estimation techniques",
	inputSchema: z.object({
		projectType: z
			.string()
			.optional()
			.describe(
				"The type of project (e.g., software development, marketing campaign)",
			),
		complexity: z
			.enum(["simple", "moderate", "complex"])
			.optional()
			.describe("The complexity level of the project"),
	}),
	outputSchema: z.object({
		approach: z.string(),
		guidelines: z.array(z.string()),
		exampleTasks: z.array(z.string()),
	}),
	execute: async ({ projectType: _projectType, complexity: _complexity }) => {
		// Mock implementation
		return {
			approach: "Work Breakdown Structure (WBS) methodology",
			guidelines: [
				"Tasks should be Specific, Measurable, Achievable, and Time-bound (SMART)",
				"Follow the 8/80 rule: tasks shouldn't be less than 8 hours or more than 80 hours",
				"Identify dependencies between tasks",
				"Assign clear ownership for each task",
			],
			exampleTasks: [
				"User Authentication Feature - 3 days - Priority: High",
				"Database Schema Design - 2 days - Dependencies: Requirements gathering",
				"API Endpoint Development - 5 days - Dependencies: Database setup",
			],
		};
	},
});

export const recommendProjectToolsTool = tool({
	name: "recommend-project-tools",
	description:
		"Recommend project management tools based on team size, requirements, and preferences",
	inputSchema: z.object({
		teamSize: z.number().describe("The number of team members"),
		budget: z
			.enum(["free", "low", "medium", "high"])
			.optional()
			.describe("Budget constraint"),
		needs: z
			.array(z.string())
			.optional()
			.describe("Specific needs (e.g., git integration, time tracking)"),
	}),
	outputSchema: z.object({
		primaryRecommendation: z.object({
			name: z.string(),
			advantages: z.array(z.string()),
			setup: z.string(),
		}),
		alternatives: z.array(
			z.object({
				name: z.string(),
				benefits: z.array(z.string()),
			}),
		),
	}),
	execute: async ({ teamSize, budget: _budget, needs: _needs }) => {
		// Mock implementation
		if (teamSize <= 5) {
			return {
				primaryRecommendation: {
					name: "Jira Software",
					advantages: [
						"Built for development teams",
						"Great for agile workflows",
						"Git integration",
						"Mobile apps available",
					],
					setup:
						"Sprint Length: 2 weeks, Board Structure: Backlog → To Do → In Progress → Code Review → Testing → Done",
				},
				alternatives: [
					{
						name: "ClickUp",
						benefits: ["Cost-effective", "More flexible", "Faster setup"],
					},
				],
			};
		}
		return {
			primaryRecommendation: {
				name: "Asana",
				advantages: [
					"Scalable for larger teams",
					"Advanced reporting",
					"Multiple project views",
				],
				setup: "Team structure: Departments → Projects → Tasks → Subtasks",
			},
			alternatives: [
				{
					name: "Monday.com",
					benefits: [
						"Highly customizable",
						"Strong automation",
						"Visual dashboards",
					],
				},
			],
		};
	},
});

export const toolSet = {
	"get-project-management-resources": getProjectManagementResourcesTool,
	"get-task-breakdown-guidance": getTaskBreakdownGuidanceTool,
	"recommend-project-tools": recommendProjectToolsTool,
};
