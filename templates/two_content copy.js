import { marked } from "marked";

export default function createTwoContentSlide(data) {
	return `
    <section class="slide">
      <h2>${marked.parse(data.title)}</h2>
      <div style="display: flex; gap: 20px;">
        <div style="flex: 1;">${marked.parse(data.content1)}</div>
        <div style="flex: 1;">${marked.parse(data.content2)}</div>
      </div>
    </section>
  `;
}
