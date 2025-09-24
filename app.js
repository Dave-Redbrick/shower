async function main() {
  try {
    const response = await fetch('presentation.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const presentation = await response.json();

    document.title = presentation.title;
    const header = document.querySelector('header.caption h1');
    if (header) {
        header.textContent = presentation.title;
    }

    const slidesContainer = document.querySelector('.shower');
    if (!slidesContainer) {
        console.error('Shower container not found');
        return;
    }

    let slidesHtml = '';
    for (const slide of presentation.slides) {
      try {
        const module = await import(`./${slide.type}.js`);
        const createSlide = module.default;
        slidesHtml += createSlide(slide.data);
      } catch (e) {
        console.error(`Could not load slide type: ${slide.type}`, e);
        // Fallback for unknown slide type
        slidesHtml += `<section class="slide"><h2>Error: Unknown slide type '${slide.type}'</h2></section>`;
      }
    }

    const headerElement = document.querySelector('header.caption');
    if (headerElement) {
        headerElement.insertAdjacentHTML('afterend', slidesHtml);
    } else {
        slidesContainer.insertAdjacentHTML('afterbegin', slidesHtml);
    }


  } catch (error) {
    console.error('Could not load presentation:', error);
    const container = document.body;
    container.innerHTML = `<section class="slide"><h2>Error loading presentation</h2><p>${error.message}</p></section>`;
  }
}

// The shower.js script initializes on DOMContentLoaded.
// We need to run our script after that. A simple timeout can work,
// but a better approach might be to see if shower exposes an event.
// For now, let's try to run it after a small delay to ensure shower.js has done its thing.
// A better way is to run it after the shower.js has been loaded.
document.addEventListener('DOMContentLoaded', () => {
    // A small delay to ensure shower.js has initialized.
    // This is a bit of a hack. If Shower has an API to re-initialize or update slides, that would be better.
    // Let's assume for now we are generating the content before shower.js runs.
    main();
});
