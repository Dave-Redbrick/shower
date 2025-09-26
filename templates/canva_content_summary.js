import { marked } from "marked";

export default function createDetailedListSlide(data, slideId) {
	const summarys = data.summarys ? data.summarys.slice(0, 2) : [];

	return `
    <section class="slide detailed-list-slide" id="${slideId}">
      <div class="dls-container">
        <div class="dls-title-box">${marked.parse(data.title)}</div>
        <div class="dls-header-box">${marked.parse(data.header)}</div>
        <div class="dls-list-container">
          ${summarys
				.map(
					(summary) => `
            <div class="dls-detail-item">
              <div class="dls-detail-icon">✔️</div>
              <div class="dls-detail-text">${marked.parse(summary)}</div>
            </div>
                    ${
						summarys.length > 1
							? `<div class="dls-divider"></div>`
							: ""
					}
            `
				)
				.join("")}

        </div>
      </div>
      <style>
        .detailed-list-slide {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          line-height: 1.08;
        }
        .dls-container {
          width: 80%;
          height: 84%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
        }
        .dls-title-box {
          display: flex;
          height: 8%;
          font-size: 240%;
          font-weight: 700;
          align-items: center;
          justify-content: center;
          margin-top: 6%;
        }
        .dls-header-box {
          display: flex;
          width: 75%;
          height: 10%;
          align-items: center;
          padding: 0.8% 3%;
          background-color: #ffd59e;
          border-radius: 50px;
          font-size: 100%;
          font-weight: 500;
          justify-content: center;
          margin-top: 8%;
        }
        .dls-list-container {
          width: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-top: 2%;
        }
        .dls-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 3%;
          padding: 2% 0;
        }
        .dls-detail-icon {
          flex-shrink: 0;
          font-size: 180%;
          color: #FFD59E;
          margin-top: 2%;
        }
        .dls-detail-text {
          font-size: 140%;
          font-weight: 500;
          line-height: 1.4;
          flex: 1;
        }
        .dls-divider {
          height: 2px;
          background-color: #262626;
          width: 100%;
          margin-bottom: 2%;
        }
      </style>
    </section>
  `;
}
