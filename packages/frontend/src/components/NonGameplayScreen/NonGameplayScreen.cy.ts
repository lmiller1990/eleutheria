import { mount as _mount } from "cypress/vue";
import NonGameplayScreen from "./NonGameplayScreen.vue";
import { NonGameplayScreenProps } from "./types";

function render(_props?: Partial<NonGameplayScreenProps>) {
  const props = {
    ..._props,
  };

  return _mount(NonGameplayScreen, {
    props,
  });
}

describe("NonGameplayScreen", () => {
  it("renders", () => {
    render({});
  });
});
