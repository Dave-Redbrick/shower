// Development mode - dynamic loading
if (import.meta.env.DEV) {
	function applyGlobalSettings(settings) {
		if (!settings) return;

		const showerElement = document.querySelector('.shower');
		let fontFamily = '';

		// Handle the consolidated 'font' property
		if (settings.font) {
			const isUrl = settings.font.startsWith('http');
			if (isUrl) {
				// It's a URL, so create a <link> tag
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = settings.font;
				document.head.appendChild(link);

				// Try to parse the font family name from the URL (works for Google Fonts)
				try {
					const url = new URL(settings.font);
					const family = url.searchParams.get('family');
					if (family) {
						fontFamily = `"${family.split(':')[0]}", sans-serif`; // Use the first family name
					}
				} catch (e) {
					console.error("Could not parse font family from URL:", e);
				}
			} else {
				// It's a font family name string
				fontFamily = settings.font;
			}
		}

		// Apply slide ratio
		if (settings.ratio && showerElement) {
			showerElement.style.setProperty('--slide-ratio', `calc(${settings.ratio})`);
		}

		// Apply styles via a <style> tag
		const style = document.createElement('style');
		let customStyles = '';

		if (fontFamily) {
			customStyles += `
				.shower, .shower * {
					font-family: ${fontFamily};
				}
			`;
		}

		if (settings.background) {
			const isUrl = settings.background.startsWith('http') || settings.background.startsWith('/');
			const backgroundValue = isUrl ? `url('${settings.background}')` : settings.background;
			customStyles += `
				.shower .slide {
					background: ${backgroundValue};
					background-size: cover;
				}
			`;
		}

		if (customStyles) {
			style.textContent = customStyles;
			document.head.appendChild(style);
		}
	}

	async function main() {
		try {
			const response = await fetch("presentation.json");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const presentation = await response.json();

			// Apply global settings from presentation.json
			applyGlobalSettings(presentation.globalSettings);

			document.title = presentation.title;
			const header = document.querySelector("header.caption h1");
			if (header) {
				header.textContent = presentation.title;
			}

			const slidesContainer = document.querySelector(".shower");
			if (!slidesContainer) {
				console.error("Shower container not found");
				return;
			}

			let slidesHtml = "";
			for (const slide of presentation.slides) {
				try {
					const module = await import(`/templates/${slide.type}.js`);
					const createSlide = module.default;
					slidesHtml += createSlide(slide.data);
				} catch (e) {
					console.error(
						`Could not load slide type: ${slide.type}`,
						e
					);
					slidesHtml += `<section class="slide"><h2>Error: Unknown slide type '${slide.type}'</h2></section>`;
				}
			}

			const headerElement = document.querySelector("header.caption");
			if (headerElement) {
				headerElement.insertAdjacentHTML("afterend", slidesHtml);
			} else {
				slidesContainer.insertAdjacentHTML("afterbegin", slidesHtml);
			}

			// Dynamically load shower core for development
			const script = document.createElement("script");
			script.src = "/node_modules/@shower/core/dist/shower.js";
			script.onload = () => {
				console.log("Shower core loaded successfully");
			};
			script.onerror = () => {
				console.error("Failed to load shower core");
			};
			document.head.appendChild(script);
		} catch (error) {
			console.error("Could not load presentation:", error);
			const container = document.body;
			container.innerHTML = `<section class="slide"><h2>Error loading presentation</h2><p>${error.message}</p></section>`;
		}
	}

	main();
}
