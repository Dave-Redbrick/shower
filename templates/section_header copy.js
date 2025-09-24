import { marked } from "marked";

export default function createSectionHeaderSlide(data) {
	return `
    <section class="slide">
      <div class="section-header">
        <h2>${marked.parse(data.title)}</h2>
        ${marked.parse(data.subtitle)}
      </div>
    </section>
  `;
}
