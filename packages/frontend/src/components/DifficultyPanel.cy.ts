import { SongDifficulty } from "../types";
import { mount } from "cypress/vue";
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
    mount(DifficultyPanel, {
      props: {
        difficulties,
        selectedIndex: 0,
      },
    });
  });
});
