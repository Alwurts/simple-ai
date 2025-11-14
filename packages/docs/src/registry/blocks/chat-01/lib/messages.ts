import type { AIUIMessage } from "@/registry/blocks/chat-01/types/ai-messages";

export const INITIAL_MESSAGES: AIUIMessage[] = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "Hi! I need help organizing my project management workflow. Can you guide me through some best practices?",
			},
		],
		role: "user",
	},
	{
		id: "2",
		parts: [
			{
				type: "tool-get-project-management-resources",
				toolCallId: "resources-1",
				state: "output-available",
				input: {
					topic: "project management best practices",
				},
				output:
					"Resources found: Project Initiation (defining objectives, identifying stakeholders), Planning Phase (task breakdown, timelines, responsibilities), Execution (monitoring progress), and Closure (documentation, lessons learned).",
			},
			{
				type: "text",
				text: "I'd be happy to help you with project management best practices! Here's a structured approach:\n\n#### 1. Project Initiation\n- Define clear project objectives\n- Identify key stakeholders\n- Set measurable goals\n- Create project charter\n\n#### 2. Planning Phase\n- Break down work into tasks\n- Set priorities\n- Create timeline\n- Assign responsibilities\n\nWould you like me to elaborate on any of these points?",
			},
		],
		role: "assistant",
	},
	{
		id: "3",
		parts: [
			{
				type: "text",
				text: "Yes, please tell me more about breaking down work into tasks. How should I approach this?",
			},
		],
		role: "user",
	},
	{
		id: "4",
		parts: [
			{
				type: "tool-get-task-breakdown-guidance",
				toolCallId: "breakdown-1",
				state: "output-available",
				input: {
					projectType: "software development",
					complexity: "moderate",
				},
				output: {
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
				},
			},
			{
				type: "text",
				text: "Breaking down work into tasks is crucial for project success. Here's a detailed approach:\n\n##### Work Breakdown Structure (WBS)\n1. **Start with major deliverables**\n   - Identify end goals\n   - List main project phases\n\n2. **Break into smaller components**\n   - Tasks should be:\n     - Specific\n     - Measurable\n     - Achievable\n     - Time-bound\n\n3. **Task Estimation**\n   ```\n   Task Example:\n   - Name: User Authentication Feature\n   - Duration: 3 days\n   - Dependencies: Database setup\n   - Priority: High\n   ```\n\n4. **Use the 8/80 Rule**\n   - Tasks shouldn't take less than 8 hours\n   - Or more than 80 hours\n   - If they do, break them down further",
			},
		],
		role: "assistant",
	},
	{
		id: "5",
		parts: [
			{
				type: "text",
				text: "That's really helpful! What tools would you recommend for tracking all these tasks?",
			},
		],
		role: "user",
	},
	{
		id: "6",
		parts: [
			{
				type: "tool-recommend-project-tools",
				toolCallId: "tools-1",
				state: "output-available",
				input: {
					teamSize: 5,
					budget: "medium",
				},
				output: {
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
				},
			},
			{
				type: "text",
				text: "Here are some popular project management tools:\n\n##### Tips for Tool Selection\n- ✅ Consider team size\n- ✅ Integration needs\n- ✅ Learning curve\n- ✅ Budget constraints\n\nWould you like specific recommendations based on your team's needs?",
			},
		],
		role: "assistant",
	},
	{
		id: "7",
		parts: [
			{
				type: "text",
				text: "Yes, we're a small team of 5 developers. What would work best for us?",
			},
		],
		role: "user",
	},
	{
		id: "8",
		parts: [
			{
				type: "tool-recommend-project-tools",
				toolCallId: "tools-2",
				state: "output-available",
				input: {
					teamSize: 5,
					budget: "medium",
					needs: ["git integration", "agile workflows"],
				},
				output: {
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
				},
			},
			{
				type: "text",
				text: "For a team of 5 developers, I'd recommend:\n\n##### Primary Choice: Jira Software\n\n**Advantages:**\n- 🔧 Built for development teams\n- 📊 Great for agile workflows\n- 🔄 Git integration\n- 📱 Mobile apps\n\n##### Alternative: ClickUp\n\n**Benefits:**\n- 💰 Cost-effective\n- 🎨 More flexible\n- 🚀 Faster setup\n\n```\nRecommended Setup:\n- Sprint Length: 2 weeks\n- Board Structure:\n  - Backlog\n  - To Do\n  - In Progress\n  - Code Review\n  - Testing\n  - Done\n- Key Features:\n  - Story Points\n  - Time Tracking\n  - Sprint Reports\n```\n\nWould you like me to explain how to set up the recommended workflow in either of these tools?",
			},
		],
		role: "assistant",
	},
];
