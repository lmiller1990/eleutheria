import { mount } from "cypress/vue";
import { songs } from "../../cypress/fixtures";
import SongSelectScreen from "./SongSelectScreen.vue";

import style from "../../../breeze-css/dist/breeze.css";

describe(
  "SongSelectScreen",
  { viewportHeight: 660, viewportWidth: 1000 },
  () => {
    it("renders", () => {
      cy.intercept(`/songs`, {
        body: songs,
      });

      mount(SongSelectScreen, {
        styles: [style],
      });
    });
  }
);
