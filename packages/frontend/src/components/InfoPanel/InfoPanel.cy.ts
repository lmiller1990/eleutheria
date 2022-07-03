import { mount as _mount } from "cypress/vue";
import InfoPanel from "./InfoPanel.vue";
import { InfoPanelProps } from "./types";

function render(_props?: Partial<InfoPanelProps>) {
  const props = {
    ..._props,
  };

  return _mount(InfoPanel, {
    props,
  });
}

describe("InfoPanel", () => {
  it("renders", () => {
    render({});
  });
});