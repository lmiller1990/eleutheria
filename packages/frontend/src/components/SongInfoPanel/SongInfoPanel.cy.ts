import { mount as _mount } from "cypress/vue";
import SongInfoPanel from "./SongInfoPanel.vue";
import { colors } from "../../shared";
import { SongInfoPanelProps } from "./types";

function render(_props?: Partial<SongInfoPanelProps>) {
  const props: SongInfoPanelProps = {
    highlightColor: colors.expert,
    data: [],
    ..._props,
  };

  return _mount(SongInfoPanel, {
    props,
    attrs: {
      class: "expert",
    },
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
    cy.contains("Stats");
  });
});
