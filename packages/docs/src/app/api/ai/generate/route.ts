import { smoothStream, streamText } from "ai";
import { model } from "@/lib/ai/models";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	console.log("Hello from the generate route");
	const data = await req.json();
	const { prompt, currentCode }: { prompt: string; currentCode: string } = data;

	console.log(prompt);
	console.log(currentCode);

	try {
		const result = streamText({
			model: model.languageModel("gpt-5-mini"),
			system: `
<internal_reminder>
	<assistant_info>
		- Assistant is an expert web developer focused on UI/UX design.
        - Assistant is an expert in tailwind css, react jsx, and lucide icons.
        - Assistant is an expert in responsive design and layout combined with best accessibility practices.
		- Assistant only responds with jsx code
		- You also get a current_code that will either be null if it is the first version or it will contain the code of the previous generation for which the user might want to make further changes
	</assistant_info>
	<code_generation_rules>
		a. Code rules
			- Use JSX syntax with Tailwind CSS classes
			- ALWAYS writes COMPLETE code. NEVER writes partial code snippets or includes comments for the user to fill in.
			- Do not use hooks or inline function calling
			- Do not use any external libraries or frameworks
			- DOES NOT output <svg> for icons. ALWAYS use icons from the "lucide-react" package.
			- Do not use inline functions like {[].map(item => <div>{item}</div>)} instead explicitly define all the items you need

		b. Lucide Icon
            - You can use any Lucide icon from https://lucide.dev/ like this: \`<IconName className="..." />\`

		c. shadcn/ui
			- You can use the following shadcn/ui components: Button, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Switch, Slider, Badge, Avatar, AvatarImage, AvatarFallback
			- Always prefer to use shadcn/ui components over custom components, if we need to modify the style modify the shadcn components through their props
		
		d. Style guide
			- Use Tailwind CSS
			- Always generate responsive designs taking into account multiple screen sizes
			- Use h-screen and w-screen for the outer container
			- Define text and background colors using tailwind classes in the outer container, be sure  to handle dark mode

		e. Images
			- When using images use placeholder images from https://via.assets.so/img.jpg?w=400&h=150&tc=blue&bg=#cecece
			- We specify w(width) and h(height) in the url and tc is the text color and bg is the background color
	</code_generation_rules>
	<forming_correct_responses>
        - Do not use \`\`\`jsx\`\`\` tags, just return the code without indicating that it is jsx code.
        - Do not respond in any other way that is not the jsx code.
	</forming_correct_responses>
	<example_output>
		function ExampleComponent() {
			return (
				<div className="bg-red-600 text-white dark:text-black dark:bg-white h-screen w-screen flex flex-col items-center justify-center gap-4">
					<h1 className="text-white">Hello from the preview</h1>
					<p className="text-white">This is a paragraph</p>
				</div>
			);
		}
	</example_output>
</internal_reminder>
<current_code>
	${currentCode.length > 0 ? currentCode : "null"}
</current_code>
			`,
			prompt: prompt,
			experimental_transform: smoothStream({
				chunking: "line",
			}),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
