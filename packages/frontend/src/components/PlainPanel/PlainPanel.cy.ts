import { mount as _mount } from "cypress/vue";
import { h } from "vue";
import PlainPanel from "./PlainPanel.vue";
import { PlainPanelProps } from "./types";

function render(
  _props: Partial<PlainPanelProps> = {},
  rest: Parameters<typeof _mount>[1] = {}
) {
  const props = {
    ..._props,
  };

  return _mount(PlainPanel, {
    props,
    ...rest,
  });
}

describe("PlainPanel", () => {
  it("renders", () => {
    render(
      {},
      {
        slots: {
          default: () =>
            h("div", { class: "flex items-center" }, [
              "2x upscroll",
              h("div", {
                style: `margin-left: 20px; background: red; height: 10px; width: 10px;`,
              }),
            ]),
        },
      }
    );
  });
});
