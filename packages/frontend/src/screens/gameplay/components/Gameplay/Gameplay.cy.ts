import { mount } from "../../../../../cypress/support/component";
import Gameplay from "./Gameplay.vue";
import { GameplayProps } from "./types";
import appStyle from "../../../../style.css";
import { noteSkins } from "../../../../../cypress/fixtures/modifiers";
import { songData, testSong } from "../../../../../cypress/fixtures/songs";

describe("Gameplay", () => {
  before(() => {
    cy.viewport(1500, 820);
  });

  it("renders", () => {
    mount<GameplayProps>(Gameplay, {
      props: {
        __testingDoNotStartSong: true,
        startGameArgs: {
          songData,
          noteSkinData: noteSkins,
          paramData: {
            id: testSong.id,
            difficulty: songData.charts[0].difficulty,
          },
          songCompleted: () => {},
        },
      },
      styles: [
        appStyle,
        "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap",
      ],
    });
  });
});
