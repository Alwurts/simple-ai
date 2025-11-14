import type { z } from "zod";
import type { profileGenerationSchema } from "./x";

type ProfileExample = z.infer<typeof profileGenerationSchema>;

const examples: ProfileExample[] = [
	// Technical Examples
	{
		displayName: "Dr. Quantum",
		username: "quantum_coder",
		aboutYou:
			"I'm a quantum computing researcher who's obsessed with machine learning applications. I spend my days trying to break through classical computing limitations and build systems that might one day change everything!",
		generationType: "technical",
	},
	{
		displayName: "CyberSec Nina",
		username: "firewall_guru",
		aboutYou:
			"I'm an ethical hacker who specializes in finding zero-day vulnerabilities. My mission is to build stronger digital defenses while teaching organizations how to protect themselves from emerging threats.",
		generationType: "technical",
	},

	// Professional Examples
	{
		displayName: "Lena V. Capital",
		username: "vc_insider",
		aboutYou:
			"As a venture capital partner focused on fintech, I help identify and scale innovative financial technologies. My passion is nurturing startups that have the potential to become tomorrow's industry leaders.",
		generationType: "professional",
	},
	{
		displayName: "HR Innovator Tom",
		username: "futureofwork_tom",
		aboutYou:
			"I'm revolutionizing workplace culture as a Chief People Officer. My current focus is creating sustainable remote work models that boost productivity while maintaining team connection.",
		generationType: "professional",
	},

	// Creative Examples
	{
		displayName: "Poetica",
		username: "word_alchemist",
		aboutYou:
			"I transform raw emotions into lyrical poetry that lingers in your soul. When I'm not crafting verses, you'll find me hosting intimate spoken word nights in cozy bookshop corners.",
		generationType: "creative",
	},
	{
		displayName: "SynthWave Maya",
		username: "80s_retro_ai",
		aboutYou:
			"I create digital art that resurrects the neon-drenched aesthetic of 1980s retro futurism. My work blends VHS nostalgia with modern AI tools to imagine what tomorrow looked like yesterday.",
		generationType: "creative",
	},

	// Fun Examples
	{
		displayName: "Pun Master Flex",
		username: "dad_joke_ceo",
		aboutYou:
			"I'm on a crusade to make the world 37% punnier! By day I'm a mild-mannered office worker, but by lunchtime I'm crafting wordplay so cheesy it needs a lactose warning. 🧀",
		generationType: "fun",
	},
	{
		displayName: "Taco Hero",
		username: "salsa_avenger",
		aboutYou:
			"I'm the self-appointed guardian of authentic Mexican street food! When I'm not hunting for the perfect taco, I'm in my kitchen experimenting with salsa recipes that make taste buds sing. 🌶️",
		generationType: "fun",
	},

	// Casual Examples
	{
		displayName: "Mountain Mike",
		username: "trail_tales",
		aboutYou:
			"Just a regular guy who finds peace in hiking trails and capturing nature through my lens. I share stories from paths less traveled - the muddier, the better!",
		generationType: "casual",
	},
	{
		displayName: "Bookish Beth",
		username: "cozyreads",
		aboutYou:
			"I'm that friend who always has book recommendations and a fresh cup of tea. Currently trying to read every mystery novel published after 1985 (wish me luck!).",
		generationType: "casual",
	},

	// Hybrid Examples
	{
		displayName: "Astro Chef",
		username: "space_kitchen",
		aboutYou:
			"I combine my love for space exploration and gourmet cooking by developing recipes that astronauts could make in zero-g! Terrestrial foodies seem to like them too. 🚀",
		generationType: "creative",
	},
	{
		displayName: "Data DJ",
		username: "analytics_beats",
		aboutYou:
			"By day I'm a data analyst crunching numbers, by night I'm mixing beats at underground clubs. Sometimes I even make songs using SQL query rhythms - nerdcore at its finest! 🎧",
		generationType: "fun",
	},
];

export function getRandomExample(): ProfileExample {
	return examples[Math.floor(Math.random() * examples.length)];
}
