import { marked } from 'marked';

export default function createTitleOnlySlide(data) {
  return `
    <section class="slide">
      <h2>${marked.parse(data.title)}</h2>
    </section>
  `;
}
