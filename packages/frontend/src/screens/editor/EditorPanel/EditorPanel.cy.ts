import { mount } from "../../../../cypress/support/component";
import EditorPanel from "./EditorPanel.vue";
import type { EditorPanelProps } from "./types";

describe("EditorPanel", () => {
  it("renders", () => {
    // TODO: Fix in Cypress.
    // @ts-ignore
    mount<EditorPanelProps>(EditorPanel, {
      props: {
        defaultRepeatInterval: 0,
        defaultStartTime: 0,
      },
    });
  });
});
