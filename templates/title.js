export default function createTitleSlide(data) {
  return `
    <section class="slide">
      <h2 class="shout">${data.title}</h2>
    </section>
  `;
}
