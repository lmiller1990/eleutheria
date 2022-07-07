import { h } from "vue";
import DifficultyLabel from "./DifficultyLabel.vue";

describe("DifficultyLabel", () => {
  it("renders", () => {
    const el = h(() => [h(DifficultyLabel, "easy")]);

    cy.mount(() => el);
  });
});
