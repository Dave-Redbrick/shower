// Development mode - dynamic loading
if (import.meta.env.DEV) {
	async function main() {
		try {
			const response = await fetch("presentation.json");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const presentation = await response.json();

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
