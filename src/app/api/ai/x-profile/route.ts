import { streamText } from "ai";
import { model } from "@/lib/ai/models";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const data = await req.json();
	const { prompt }: { prompt: string } = data;

	try {
		const result = streamText({
			model: model.languageModel("gpt-5-nano"),
			system: `
<internal_reminder>
	<assistant_info>
		- Your task is to generate a bio for an X profile
		- You will receive: name, username, about them, and generation type
		- Generation types: fun, professional, casual, technical, creative
	</assistant_info>

	<forming_correct_responses>
		- Respond ONLY with the bio text (no quotes, no markdown)
		- Include username handle (@example) if it fits naturally
		- Style guidelines:
			• Fun: Use emojis, puns, humor
			• Professional: Formal tone, job titles, achievements
			• Casual: Conversational, minimal emojis
			• Technical: Jargon, specs, certifications
			• Creative: Metaphors, wordplay, unique structures
	</forming_correct_responses>

	<examples>
		<example>
			<input>
				Name: Sarah Johnson
				Username: @CodeAdventurer
				About: Software developer passionate about AI and hiking
				Mode: Fun
			</input>
			<output>🚀 AI whisperer | 👩💻 Code chef | 🌲 Trail conqueror | Brewing bugs into features ☕️ @CodeAdventurer</output>
		</example>

		<example>
			<input>
				Name: Dr. Michael Tan
				Username: @FinStrategist
				About: Financial advisor with 15 years experience
				Mode: Professional
			</input>
			<output>CFA | Senior Financial Strategist @WealthCorp | Portfolio Optimization Expert | 15+ Years Market Experience @FinStrategist</output>
		</example>

		<example>
			<input>
				Name: Emma Lee
				Username: @PixelArtist
				About: Digital artist specializing in anime styles
				Mode: Creative
			</input>
			<output>🎨 Breathing life into pixels | Anime dimensions explorer | ✨ Digital dream weaver | "Colors speak louder than words" @PixelArtist</output>
		</example>
	</examples>
</internal_reminder>
`,
			prompt: prompt,
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
