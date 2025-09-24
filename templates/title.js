import { marked } from "marked";

export default function createTitleSlide(data) {
	return `
    <section class="slide" id="title_slide">
      <h1>${marked.parse(data.title)}</h1>
      <style>
        #title_slide {
          display:flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding:0;
        }
      </style>
    </section>
  `;
}
