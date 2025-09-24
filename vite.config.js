import { defineConfig } from "vite";
import { readFileSync, copyFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

export default defineConfig({
	server: {
		port: 3000,
		open: true,
	},
	build: {
		outDir: "dist",
		assetsDir: "assets",
		rollupOptions: {
			input: {
				main: "index.html",
			},
		},
	},
	plugins: [
		{
			name: "inline-presentation",
			transformIndexHtml: {
				enforce: "pre",
				async transform(html, context) {
					// Only transform for build, not dev
					if (context.server) {
						return html;
					}

					try {
						// Read presentation data
						const presentationData = JSON.parse(
							readFileSync("presentation.json", "utf-8")
						);

						// Generate slides HTML
						let slidesHtml = "";
						for (const slide of presentationData.slides) {
							try {
								const templatePath = resolve(
									`templates/${slide.type}.js`
								);
								const templateModule = await import(
									`file://${templatePath}`
								);
								const createSlide = templateModule.default;
								slidesHtml += createSlide(slide.data);
							} catch (e) {
								console.warn(
									`Could not load slide type: ${slide.type}`,
									e
								);
								slidesHtml += `<section class="slide"><h2>Error: Unknown slide type '${slide.type}'</h2></section>`;
							}
						}

						// Replace placeholders in HTML
						return html
							.replace(
								"<h1></h1>",
								`<h1>${presentationData.title}</h1>`
							)
							.replace(
								"<title>Shower Presentation Engine</title>",
								`<title>${presentationData.title}</title>`
							)
							.replace("<!-- SLIDES_PLACEHOLDER -->", slidesHtml)
							.replace(
								'<script type="module" src="app.js"></script>',
								'<script src="./shower.js"></script>'
							);
					} catch (error) {
						console.error(
							"Error generating static presentation:",
							error
						);
						return html;
					}
				},
			},
			generateBundle() {
				try {
					// Copy shower.js to dist directory
					const showerSrc =
						"node_modules/@shower/core/dist/shower.js";
					const showerDest = "dist/shower.js";

					// Ensure dist directory exists
					mkdirSync("dist", { recursive: true });

					// Copy the shower core file
					copyFileSync(showerSrc, showerDest);
					console.log("Copied shower.js to dist directory");
				} catch (error) {
					console.error("Error copying shower.js:", error);
				}
			},
		},
	],
});
