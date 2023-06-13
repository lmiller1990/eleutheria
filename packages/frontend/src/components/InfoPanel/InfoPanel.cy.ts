import { mount as _mount } from "cypress/vue";
import InfoPanel from "./InfoPanel.vue";
import { InfoPanelProps } from "./types";

function render(_props?: Partial<InfoPanelProps>) {
  const props: InfoPanelProps = {
    panelTitle: "Panel Title",
    ..._props,
  };

  // @ts-ignore
  return _mount(InfoPanel, {
    props,
  });
}

describe("InfoPanel", () => {
  it("renders", () => {
    render({});
    expect(1).to.eq(3);
  });
});
