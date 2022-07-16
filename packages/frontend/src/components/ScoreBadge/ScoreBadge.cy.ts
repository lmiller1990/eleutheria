import { mount as _mount } from "cypress/vue";
import ScoreBadge from "./ScoreBadge.vue";
import { ScoreBadgeProps } from "./types";

function render(_props?: Partial<ScoreBadgeProps>) {
  const props = {
    ..._props,
  };

  // TODO: why do we need `as any`
  return _mount(ScoreBadge as any, {
    props,
  });
}

describe("ScoreBadge", () => {
  it("renders", () => {
    render({});
  });
});
