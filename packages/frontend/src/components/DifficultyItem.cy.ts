import { h } from "vue";
import DifficultyItem from "./DifficultyItem.vue";
import { difficulties } from "../constants";

describe("DifficultyItem.cy.ts", () => {
  it("playground", () => {
    const Wrapper = () =>
      h(
        "div",
        {},
        difficulties.map((name) =>
          h(DifficultyItem, { difficulty: { name, level: 5 } })
        )
      );

    cy.mount(Wrapper);
  });
});
