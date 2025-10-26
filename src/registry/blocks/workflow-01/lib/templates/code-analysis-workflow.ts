import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/lib/workflow/types";

// Code Analysis Workflow: Start -> Code Analyzer -> Language Router -> Specialized Agents -> End
export const CODE_ANALYSIS_WORKFLOW: { nodes: FlowNode[]; edges: FlowEdge[] } =
	{
		nodes: [
			{
				id: "start-node",
				type: "start",
				position: { x: 100, y: 200 },
				data: {
					sourceType: { type: "text" },
				},
			},
			{
				id: "code-analyzer-node",
				type: "agent",
				position: { x: 450, y: 200 },
				data: {
					name: "Code Analyzer",
					status: "idle",
					hideResponseInChat: false,
					excludeFromConversation: true,
					maxSteps: 5,
					model: "gpt-5-nano",
					systemPrompt: `You are a code analysis expert. Analyze the provided code snippet and determine its programming language and key characteristics.

Return a structured analysis with:
- language: The primary programming language (e.g., "typescript", "python", "javascript", "java", "csharp", "cpp", "go", "rust", "php", "ruby", "swift", "kotlin")
- framework: Any specific framework or library used (if detectable)
- complexity: "simple", "medium", or "complex"
- has_errors: boolean indicating if there are obvious syntax/logic errors

Focus on accurate language detection and provide concise, structured output.`,
					selectedTools: [],
					sourceType: {
						type: "structured",
						schema: {
							type: "object",
							properties: {
								language: {
									type: "string",
									description:
										"The programming language of the code",
									enum: [
										"typescript",
										"javascript",
										"python",
										"java",
										"csharp",
										"cpp",
										"go",
										"rust",
										"php",
										"ruby",
										"swift",
										"kotlin",
										"other",
									],
								},
								framework: {
									type: "string",
									description:
										"Framework or library used (if any)",
								},
								complexity: {
									type: "string",
									description: "Code complexity level",
									enum: ["simple", "medium", "complex"],
								},
								has_errors: {
									type: "boolean",
									description:
										"Whether the code has obvious errors",
								},
							},
							required: ["language", "complexity", "has_errors"],
						},
					},
				},
			},
			{
				id: "language-router-node",
				type: "if-else",
				position: { x: 850, y: 200 },
				data: {
					status: "idle",
					dynamicSourceHandles: [
						{
							id: "typescript-route",
							label: "TypeScript",
							condition: "input.language == 'typescript'",
						},
						{
							id: "python-route",
							label: "Python",
							condition: "input.language == 'python'",
						},
						{
							id: "javascript-route",
							label: "JavaScript",
							condition: "input.language == 'javascript'",
						},
						{
							id: "java-route",
							label: "Java",
							condition: "input.language == 'java'",
						},
					],
				},
			},
			{
				id: "typescript-specialist-node",
				type: "agent",
				position: { x: 1250, y: -50 },
				data: {
					name: "TypeScript Specialist",
					model: "gpt-5-nano",
					systemPrompt: `You are a TypeScript expert. Analyze the provided TypeScript code and provide detailed feedback including:

1. Code quality assessment
2. Type safety evaluation
3. Performance considerations
4. Best practices compliance
5. Suggested improvements

Be thorough but concise in your analysis. Focus on TypeScript-specific patterns, type annotations, and modern TypeScript features.`,
					selectedTools: [],
					sourceType: { type: "text" },
					status: "idle",
					hideResponseInChat: false,
					excludeFromConversation: false,
					maxSteps: 5,
				},
			},
			{
				id: "python-specialist-node",
				type: "agent",
				position: { x: 1250, y: 150 },
				data: {
					name: "Python Specialist",
					model: "gpt-5-nano",
					systemPrompt: `You are a Python expert. Analyze the provided Python code and provide detailed feedback including:

1. Code quality assessment (PEP 8 compliance, readability)
2. Performance considerations
3. Pythonic patterns and best practices
4. Error handling and edge cases
5. Suggested improvements

Focus on Python-specific idioms, efficient data structures, and modern Python features.`,
					selectedTools: [],
					sourceType: { type: "text" },
					status: "idle",
					hideResponseInChat: false,
					excludeFromConversation: false,
					maxSteps: 5,
				},
			},
			{
				id: "javascript-specialist-node",
				type: "agent",
				position: { x: 1250, y: 350 },
				data: {
					name: "JavaScript Specialist",
					model: "gpt-5-nano",
					systemPrompt: `You are a JavaScript expert. Analyze the provided JavaScript code and provide detailed feedback including:

1. Code quality assessment
2. ES6+ features usage
3. Performance considerations
4. Browser compatibility
5. Security considerations
6. Suggested improvements

Focus on modern JavaScript patterns, asynchronous programming, and best practices.`,
					selectedTools: [],
					sourceType: { type: "text" },
					status: "idle",
					hideResponseInChat: false,
					excludeFromConversation: false,
					maxSteps: 5,
				},
			},
			{
				id: "java-specialist-node",
				type: "agent",
				position: { x: 1250, y: 550 },
				data: {
					name: "Java Specialist",
					model: "gpt-5-nano",
					systemPrompt: `You are a Java expert. Analyze the provided Java code and provide detailed feedback including:

1. Code quality assessment
2. Object-oriented design patterns
3. Performance considerations
4. Memory management
5. Exception handling
6. Suggested improvements

Focus on Java-specific patterns, JVM considerations, and enterprise Java best practices.`,
					selectedTools: [],
					sourceType: { type: "text" },
					status: "idle",
					hideResponseInChat: false,
					excludeFromConversation: false,
					maxSteps: 5,
				},
			},
			{
				id: "general-specialist-node",
				type: "agent",
				position: { x: 1250, y: 750 },
				data: {
					name: "General Code Specialist",
					model: "gpt-5-nano",
					systemPrompt: `You are a general programming expert. Analyze the provided code and provide feedback on:

1. Overall code quality and structure
2. Algorithm efficiency
3. Error handling
4. Documentation and readability
5. General best practices
6. Suggested improvements

Provide comprehensive analysis regardless of the programming language.`,
					selectedTools: [],
					sourceType: { type: "text" },
					status: "idle",
					hideResponseInChat: false,
					excludeFromConversation: false,
					maxSteps: 5,
				},
			},
			{
				id: "end-node",
				type: "end",
				position: { x: 1650, y: 400 },
				data: {},
			},
			{
				id: "workflow-description-note",
				type: "note",
				position: { x: 100, y: 600 },
				data: {
					content:
						"Code Analysis Workflow\n\nThis workflow demonstrates intelligent routing based on code analysis:\n\n1. Code Analyzer: Detects programming language and analyzes code characteristics\n2. Language Router: Routes to specialized agents based on detected language\n3. Specialized Agents: Provide language-specific expertise and feedback\n4. General Specialist: Handles cases where language detection is uncertain\n\nFeatures:\n- Structured output from analyzer\n- Conditional routing with multiple branches\n- Specialized agents for different languages\n- Fallback handling for unknown languages\n\nTry providing different code snippets to see how the workflow routes to different specialists!",
				},
			},
		],
		edges: [
			{
				id: "start-to-analyzer",
				source: "start-node",
				target: "code-analyzer-node",
				sourceHandle: "message",
				targetHandle: "prompt",
				type: "status",
			},
			{
				id: "analyzer-to-router",
				source: "code-analyzer-node",
				target: "language-router-node",
				sourceHandle: "result",
				targetHandle: "input",
				type: "status",
			},
			{
				id: "router-to-typescript",
				source: "language-router-node",
				target: "typescript-specialist-node",
				sourceHandle: "typescript-route",
				targetHandle: "prompt",
				type: "status",
			},
			{
				id: "router-to-python",
				source: "language-router-node",
				target: "python-specialist-node",
				sourceHandle: "python-route",
				targetHandle: "prompt",
				type: "status",
			},
			{
				id: "router-to-javascript",
				source: "language-router-node",
				target: "javascript-specialist-node",
				sourceHandle: "javascript-route",
				targetHandle: "prompt",
				type: "status",
			},
			{
				id: "router-to-java",
				source: "language-router-node",
				target: "java-specialist-node",
				sourceHandle: "java-route",
				targetHandle: "prompt",
				type: "status",
			},
			{
				id: "router-to-general",
				source: "language-router-node",
				target: "general-specialist-node",
				sourceHandle: "else",
				targetHandle: "prompt",
				type: "status",
			},
			{
				id: "typescript-to-end",
				source: "typescript-specialist-node",
				target: "end-node",
				sourceHandle: "result",
				targetHandle: "input",
				type: "status",
			},
			{
				id: "python-to-end",
				source: "python-specialist-node",
				target: "end-node",
				sourceHandle: "result",
				targetHandle: "input",
				type: "status",
			},
			{
				id: "javascript-to-end",
				source: "javascript-specialist-node",
				target: "end-node",
				sourceHandle: "result",
				targetHandle: "input",
				type: "status",
			},
			{
				id: "java-to-end",
				source: "java-specialist-node",
				target: "end-node",
				sourceHandle: "result",
				targetHandle: "input",
				type: "status",
			},
			{
				id: "general-to-end",
				source: "general-specialist-node",
				target: "end-node",
				sourceHandle: "result",
				targetHandle: "input",
				type: "status",
			},
		],
	};
