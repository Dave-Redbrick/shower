import { marked } from "marked";

export default function createComparisonSlide(data) {
	return `
    <section class="slide" id="comparison-slide">
      <div class="c-slide-container">
        <div class="c-slide-title-box">
          ${marked.parseInline(data.title)}
        </div>
        <div class="c-slide-compare-container">
          <div class="c-slide-col">
            <div class="c-slide-col-title">
              ${marked.parseInline(data.subtitle1)}
            </div>
            <div class="c-slide-col-content">
              ${marked.parse(data.content1)}
            </div>
          </div>
          <div class="c-slide-col">
            <div class="c-slide-col-title">
              ${marked.parseInline(data.subtitle2)}
            </div>
            <div class="c-slide-col-content">
              ${marked.parse(data.content2)}
            </div>
          </div>
        </div>
      </div>
      <style>
        #comparison-slide {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          line-height: 1.08;
        }
        .c-slide-container {
          width: 85%;
          height: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .c-slide-title-box {
          height: 14vw;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 7vw;
          margin-bottom: 1%;
        }
        .c-slide-compare-container {
          display: flex;
          gap: 1%;
          height:50%
        }
        .c-slide-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .c-slide-col-title {
          height: 25%;
          font-size: 3.5vw;
          font-weight: bold;
          align-items: flex-end;
        }
        .c-slide-col-content {
          height: 100%;
          font-size: 4.2vw;
          overflow-y: auto;
        }
      </style>
    </section>
  `;
}
