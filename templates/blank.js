export default function createBlankSlide(data, slideId, style) {
  return `
    <section class="slide" id="${slideId}" style="${style || ""}"></section>
  `;
}
