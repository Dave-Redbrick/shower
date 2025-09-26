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

						// Generate slides HTML and collect styles
						let slidesHtml = "";
						let fontLinks = new Set();
						let globalStyles = "";

						// Handle global settings
						if (presentationData.globalSettings) {
							const settings = presentationData.globalSettings;
							if (settings.font) {
								if (settings.font.startsWith("http")) {
									fontLinks.add(settings.font);
									try {
										const url = new URL(settings.font);
										const family =
											url.searchParams.get("family");
										if (family) {
											globalStyles += `.shower, .shower h1, .shower h2, .shower p, .shower li { font-family: "${
												family.split(":")[0]
											}", sans-serif !important; }`;
										}
									} catch (e) {
										console.error(
											"Could not parse font family from URL:",
											e
										);
									}
								} else {
									globalStyles += `.shower, .shower h1, .shower h2, .shower p, .shower li { font-family: ${settings.font} !important; }`;
								}
							}
							if (settings.background) {
								const isUrl =
									settings.background.startsWith("http") ||
									settings.background.startsWith("/");
								const backgroundValue = isUrl
									? `url('${settings.background}')`
									: settings.background;
								globalStyles += `.shower .slide { background: ${backgroundValue} !important; background-size: cover !important; }`;
							}
							if (settings.ratio) {
								globalStyles += `.shower { --slide-ratio: calc(${settings.ratio}); }`;
							}
						}

						for (const [index, slide] of presentationData.slides.entries()) {
							try {
								const templatePath = resolve(
									`templates/${slide.type}.js`
								);
								const templateModule = await import(
									`file://${templatePath}`
								);
								const createSlide = templateModule.default;
								const slideId = `${index + 1}`;

								// Handle slide-specific styles
								let backgroundStyle = "";
								let fontStyleBlock = "";

								if (slide.font) {
									let fontFamily = "";
									if (slide.font.startsWith("http")) {
										fontLinks.add(slide.font);
										try {
											const url = new URL(slide.font);
											const family =
												url.searchParams.get("family");
											if (family) {
												fontFamily = `'${
													family.split(":")[0]
												}', sans-serif`;
											}
										} catch (e) {
											console.error(
												"Could not parse font family from URL:",
												e
											);
										}
									} else {
										fontFamily = slide.font;
									}
									if (fontFamily) {
										fontStyleBlock = `<style>[id='${slideId}'] h1, [id='${slideId}'] h2, [id='${slideId}'] p, [id='${slideId}'] li { font-family: ${fontFamily} !important; }</style>`;
									}
								}

								if (slide.background) {
									const isUrl =
										slide.background.startsWith("http") ||
										slide.background.startsWith("/");
									const backgroundValue = isUrl
										? `url('${slide.background}')`
										: slide.background;
									backgroundStyle = `background: ${backgroundValue} !important; background-size: cover !important;`;
								}

								// Pass styles to the createSlide function
								slidesHtml += createSlide(
									slide.data,
									slideId,
									backgroundStyle,
									fontStyleBlock
								);
							} catch (e) {
								console.warn(
									`Could not load slide type: ${slide.type}`,
									e
								);
								slidesHtml += `<section class="slide"><h2>Error: Unknown slide type '${slide.type}'</h2></section>`;
							}
						}

						// Prepare font links and global styles to be injected
						const fontLinkTags = [...fontLinks]
							.map(
								(href) =>
									`<link rel="stylesheet" href="${href}">`
							)
							.join("\n");
						const styleTag = globalStyles.trim()
							? `<style>${globalStyles}</style>`
							: "";

						// Replace placeholders in HTML
						let finalHtml = html
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
								'<script type="module" src="/shower.js"></script>'
							)
							.replace(
								"</head>",
								`${fontLinkTags}\n${styleTag}\n</head>`
							);

						return finalHtml;
					} catch (error) {
						console.error(
							"Error generating static presentation:",
							error
						);
						return html;
					}
				},
			},
		},
	],
});
