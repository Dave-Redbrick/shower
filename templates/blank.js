export default function createBlankSlide(
	data,
	slideId,
	inlineStyle,
	fontStyleBlock
) {
	return `
    <section class="slide" id="${slideId}" style="${inlineStyle || ""}">${
		fontStyleBlock || ""
	}</section>
  `;
}
