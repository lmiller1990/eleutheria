import { mount as _mount } from "cypress/vue";
import NonGameplayScreen from "./NonGameplayScreen.vue";

function render() {
  return _mount(NonGameplayScreen as any);
}

describe("NonGameplayScreen", () => {
  it("renders", () => {
    render();
  });
});
