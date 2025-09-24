import { marked } from 'marked';

export default function createTitleSlide(data) {
  return `
    <section class="slide">
      <h2 class="shout">${marked.parse(data.title)}</h2>
    </section>
  `;
}
