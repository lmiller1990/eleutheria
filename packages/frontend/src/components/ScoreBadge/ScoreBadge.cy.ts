import { mount as _mount } from "cypress/vue";
import ScoreBadge from "./ScoreBadge.vue";
import { ScoreBadgeProps } from "./types";

function render(_props?: Partial<ScoreBadgeProps>) {
  const props = {
    ..._props,
  };

  return _mount(ScoreBadge, {
    props,
  });
}

describe("ScoreBadge", () => {
  it("renders", () => {
    render({});
  });
});
