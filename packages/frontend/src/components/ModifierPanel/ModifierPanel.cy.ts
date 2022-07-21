import { mount as _mount } from "cypress/vue";
import ModifierPanel from "./ModifierPanel.vue";
import { noteSkins } from "../../../cypress/fixtures/modifiers";
import { ModifierPanelProps } from "./types";

function render(
  _props: Partial<ModifierPanelProps>,
  rest: Parameters<typeof _mount>[1] = {}
) {
  const props: ModifierPanelProps = {
    currentSpeed: 6,
    currentScroll: "up",
    notes: noteSkins,
    ..._props,
  };

  // TODO: Why do we need `as any`?s
  return _mount(ModifierPanel as any, {
    props,
    ...rest,
  });
}

describe("ModifierPanel", () => {
  it("renders", () => {
    const onChangeSpeedMod = cy.stub();

    render(
      {},
      {
        attrs: {
          onChangeSpeedMod,
        },
      }
    );

    cy.get("button")
      .contains("-100")
      .click()
      .then(() => {
        expect(onChangeSpeedMod).to.have.been.calledWith(-0.25);
      });
  });
});
