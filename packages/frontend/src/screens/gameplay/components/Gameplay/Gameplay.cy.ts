import { mount as _mount } from "cypress/vue";
import Gameplay from "./Gameplay.vue";
import { GameplayProps } from "./types";

function render(_props: Partial<GameplayProps>, rest: Parameters<typeof _mount>[1] = {}) {
  const props: GameplayProps = {
    ..._props,
  };

  return _mount(Gameplay, {
    props,
    ...rest
  });
}

describe("Gameplay", () => {
  it("renders", () => {
    render({});
  });
});