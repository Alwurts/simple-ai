import { existsSync, unlinkSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const REGISTRY_PATH = path.join(process.cwd(), "public/r");
const clearExisting = true;

// ----------------------------------------------------------------------------
// Capture screenshots.
// ----------------------------------------------------------------------------
async function captureScreenshots() {
	const { getAllRegistryItemIds } = await import("../lib/registry");

	const blockIds = await getAllRegistryItemIds(["registry:block"]);
	const blocks = clearExisting
		? blockIds
		: blockIds.filter((block) => {
				// Check if screenshots already exist
				const lightPath = path.join(
					REGISTRY_PATH,
					`${block}-light.png`,
				);
				const darkPath = path.join(REGISTRY_PATH, `${block}-dark.png`);
				return !existsSync(lightPath) || !existsSync(darkPath);
			});

	if (blocks.length === 0) {
		console.log("✨ All screenshots exist, nothing to capture");
		return;
	}

	const browser = await puppeteer.launch({
		defaultViewport: {
			width: 1440,
			height: 900,
			deviceScaleFactor: 2,
		},
	});

	for (const block of blocks) {
		const pageUrl = `http://localhost:4567/view/${block}`;

		const page = await browser.newPage();
		await page.goto(pageUrl, {
			waitUntil: "networkidle2",
		});

		console.log(`- Capturing ${block}...`);

		for (const theme of ["light", "dark"]) {
			const screenshotPath = path.join(
				REGISTRY_PATH,
				`${block}${theme === "dark" ? "-dark" : "-light"}.png`,
			);

			if (!clearExisting && existsSync(screenshotPath)) {
				continue;
			}

			// Clear existing screenshot if flag is set
			if (clearExisting && existsSync(screenshotPath)) {
				unlinkSync(screenshotPath);
			}

			// Set theme and reload page
			await page.evaluate((currentTheme) => {
				localStorage.setItem("theme", currentTheme);
			}, theme);

			await page.reload({ waitUntil: "networkidle2" });

			// Wait for animations to complete
			if (block.startsWith("chart") || block.startsWith("dashboard")) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}

			// Hide Tailwind indicator
			await page.evaluate(() => {
				const indicator = document.querySelector(
					"[data-tailwind-indicator]",
				);
				if (indicator) {
					indicator.remove();
				}
			});

			// Close Next.js developer indicator
			await page.evaluate(() => {
				const indicator = document.querySelector("#devtools-indicator");
				if (indicator) {
					indicator.remove();
				}
				const indicator2 = document.querySelector(
					'div[data-nextjs-toast="true"]',
				);
				if (indicator2) {
					indicator2.remove();
				}
			});

			await page.screenshot({
				path: screenshotPath as `${string}.png`,
			});
		}

		await page.close();
	}

	await browser.close();
}

try {
	console.log("🔍 Capturing screenshots...");

	await captureScreenshots();

	console.log("✅ Done!");
} catch (error) {
	console.error(error);
	process.exit(1);
}
