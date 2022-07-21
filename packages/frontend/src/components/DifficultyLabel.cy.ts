import { h } from "vue";
import DifficultyLabel from "./DifficultyLabel.vue";

describe("DifficultyLabel", () => {
  it("renders", () => {
    const el = h(() => [h(DifficultyLabel, "easy")]);

    // @ts-ignore
    cy.mount(() => el);
  });
});
