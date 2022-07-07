import { SongDifficulty } from "../types";
import DifficultyPanel from "./DifficultyPanel.vue";

const difficulties: SongDifficulty[] = [
  {
    name: "basic",
    level: 5,
  },
  {
    name: "standard",
    level: 7,
  },
  {
    name: "expert",
    level: 9,
  },
];

describe("DifficultyPanel", () => {
  it("renders", () => {
    cy.mount(DifficultyPanel, {
      style: `
        body {
          background: #828282;
        }
      `,
      props: {
        difficulties,
        selectedIndex: 0,
      },
    });
  });
});
