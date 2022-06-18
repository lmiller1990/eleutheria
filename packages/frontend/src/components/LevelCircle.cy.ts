import { h } from "vue";
import LevelCircle from "./LevelCircle.vue";

describe("LevelCircle", () => {
  it("default size", () => {
    const el = h(() => [
      h(LevelCircle, { level: 75, maxLevel: 100 }),
      h(LevelCircle, { height: 100, level: 10, max: 40 }),
    ]);

    cy.mount(() => el);
  });
});
