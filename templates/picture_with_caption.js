import { marked } from 'marked';

export default function createPictureWithCaptionSlide(data) {
  return `
    <section class="slide">
      <h2>${marked.parse(data.title)}</h2>
      <div style="display: flex; gap: 20px;">
        <div style="flex: 1;">${marked.parse(data.caption)}</div>
        <div style="flex: 2;">
          <img src="${data.imageUrl}" alt="${data.altText || ''}" style="max-width: 100%; height: auto;">
        </div>
      </div>
    </section>
  `;
}
