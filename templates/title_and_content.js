import { marked } from "marked";

export default function createTitleAndContentSlide(data) {
	return `
    <section class="slide" id="title-and-content-slide">
      <div class="tac-slide-container">
        <div class="tac-slide-title-box">
          ${marked.parse(data.title)}
        </div>
        <div class="tac-slide-content-box">
          ${marked.parse(data.content)}
        </div>
      </div>
      <style>
        #title-and-content-slide {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0px;
          line-height: 1.08;
        }
        .tac-slide-container {
          width: 85%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          height: 100%;
        }
        .tac-slide-title-box, .title-slide-subtitle-box {
          width: 100%;
        }
        .tac-slide-title-box {
          display: flex;
          height: 14vw;
          align-items: center;
          justify-content: start;
          font-size: 7vw;
          margin-bottom: 1%; 
        }
        .tac-slide-content-box {
          display: flex;
          flex-direction: column;
          height: 65%;
          align-items: flex-start;
          justify-content: start;
          font-size: 4.2vw;
        }
      </style>
    </section>
  `;
}
