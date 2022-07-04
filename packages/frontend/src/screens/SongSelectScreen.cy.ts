import { mount } from "cypress/vue";
import { testSong } from "../../cypress/fixtures/songs";
import SongSelectScreen from "./SongSelectScreenOld.vue";

import style from "../../../breeze-css/dist/breeze.css";

describe(
  "SongSelectScreen",
  { viewportHeight: 660, viewportWidth: 1000 },
  () => {
    it("renders", () => {
      cy.intercept(`/songs`, {
        body: [testSong],
      });

      mount(SongSelectScreen, {
        styles: [style],
      });
    });
  }
);
