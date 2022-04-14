import { mount } from "@cypress/vue";
import { BaseSong } from "@packages/types";
import SongSelectScreen from "./SongSelectScreen.vue";

const songs: BaseSong[] = Array(10)
  .fill(undefined)
  .map((_, idx) => ({
    id: (idx + 1).toString(),
    bpm: 150,
    charts: [],
    title: `Test Song #${idx + 1}`,
  }));

describe(
  "SongSelectScreen",
  { viewportHeight: 660, viewportWidth: 1000 },
  () => {
    it("renders", () => {
      cy.intercept(`/songs`, {
        body: songs,
      });

      mount(SongSelectScreen);
    });
  }
);
