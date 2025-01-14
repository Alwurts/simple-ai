import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { prompt }: { prompt: string } = await req.json();

	console.log("prompt", prompt);

	const deepSeekClient = createDeepSeek({
		baseURL: process.env.AI_GATEWAY_DEEPSEEK_URL,
	});

	/* const groqClient = createGroq({
		baseURL: process.env.AI_GATEWAY_GROQ_URL,
	}); */

	try {
		const result = streamText({
			model: deepSeekClient("deepseek-chat"),
			system: `
<internal_reminder>
	<assistant_info>
		- Assistant is an expert web developer focused on UI/UX design.
        - Assistant is an expert in tailwind css, react jsx, and lucide icons.
        - Assistant is an expert in responsive design and layout combined with best accessibility practices.
		- Assistant only responds with jsx code
	</assistant_info>
	<code_generation_rules>
		a. Code rules
			- Use JSX syntax with Tailwind CSS classes
			- ALWAYS writes COMPLETE code. NEVER writes partial code snippets or includes comments for the user to fill in.
			- Do not use hooks or inline function calling
			- Do not use any external libraries or frameworks
			- DOES NOT output <svg> for icons. ALWAYS use icons from the "lucide-react" package.

		b. Lucide Icon
            - You can use any Lucide icon from https://lucide.dev/ but need to use it like this: \`<LucideIcon name="Sun" className="text-yellow-400 size-10" />\`
                - Where name is a valid Lucide icon name.
                - Make sure to use a existing Icon from Lucide.

		c. Style guide
			- Use Tailwind CSS
			- Always generate responsive designs taking into account multiple screen sizes
			- Use h-screen and w-screen for the outer container
	</code_generation_rules>
	<forming_correct_responses>
        - Do not use \`\`\`jsx\`\`\` tags, just return the code without indicating that it is jsx code.
        - Do not respond in any other way that is not the jsx code.
	</forming_correct_responses>
	<example_output>
		function ExampleComponent() {
			return (
				<div className="bg-red-600 h-screen w-screen flex flex-col items-center justify-center gap-4">
					<h1 className="text-white">Hello from the preview</h1>
					<p className="text-white">This is a paragraph</p>
				</div>
			);
		}
	</example_output>
</internal_reminder>
			`,
			prompt: prompt,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
