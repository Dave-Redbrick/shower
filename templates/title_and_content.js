export default function createTitleAndContentSlide(data) {
  return `
    <section class="slide">
      <h2>${data.title}</h2>
      ${data.content}
    </section>
  `;
}
