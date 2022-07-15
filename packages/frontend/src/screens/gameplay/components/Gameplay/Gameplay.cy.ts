import { mount as _mount } from "cypress/vue";
import { songData, testSong } from "../../../../../cypress/fixtures/songs";
import Gameplay from "./Gameplay.vue";
import { GameplayProps } from "./types";
import appStyle from "../../../../style.css";
import { noteSkins } from "../../../../../cypress/fixtures/modifiers";
import { useSongsStore } from "../../../../stores/songs";

function render(
  _props: Partial<GameplayProps>,
  rest: Parameters<typeof _mount>[1] = {}
) {
  const props: GameplayProps = {
    ..._props,
    startGameArgs: {
      songData,
      noteSkinData: noteSkins,
      paramData: {
        id: testSong.id,
        difficulty: songData.charts[0].difficulty,
      },
      gameplayModifiers: {
        scroll: "up",
        speed: 1,
      },
      songCompleted: () => {},
    },
  };

  return _mount(Gameplay, {
    props,
    ...rest,
  });
}

describe("Gameplay", () => {
  beforeEach(() => {
    const songsStore = useSongsStore();
    songsStore.$patch((state) => {
      state.songs = [testSong];
      state.selectedSongId = testSong.id;
      state.selectedChartIdx = 0;
    });
  });

  before(() => {
    cy.viewport(1500, 820);
  });

  it("renders", () => {
    render(
      { __testingDoNotStartSong: true },
      {
        styles: [
          // style,
          appStyle,
          "https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap",
        ],
      }
    );
  });
});
