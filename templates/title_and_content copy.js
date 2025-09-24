import { marked } from "marked";

export default function createTitleAndContentSlide(data) {
	return `
    <section class="slide">
      <h2>${marked.parse(data.title)}</h2>
      ${marked.parse(data.content)}
    </section>
  `;
}
