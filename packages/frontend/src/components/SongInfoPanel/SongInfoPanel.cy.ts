import { mount as _mount } from "cypress/vue";
import SongInfoPanel from "./SongInfoPanel.vue";
import { SongInfoPanelProps } from "./types";

function render(_props?: Partial<SongInfoPanelProps>) {
  const props: SongInfoPanelProps = {
    personalBest: "99.50",
    bpm: 155,
    noteCount: 1100,
    duration: "1:50",
    ..._props,
  };

  return _mount(SongInfoPanel, {
    props,
    style: `
      body {
        background: #828282;
      }
    `,
  });
}

describe("SongInfoPanel", () => {
  it("renders title and slot content", () => {
    render();
    cy.contains("Panel title");
  });
});
