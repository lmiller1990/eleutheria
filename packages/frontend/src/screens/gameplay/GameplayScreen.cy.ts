import GameplayScreen from "./GameplayScreen.vue";
import { mount } from "../../../cypress/support/mount";
import { useSongsStore } from "../../stores/songs";
import { testSong } from "../../../cypress/fixtures/songs";

describe("GameplayScreen", () => {
  beforeEach(() => {
    const songsStore = useSongsStore();
    songsStore.$patch((state) => {
      state.songs = [testSong];
      state.selectedSongId = testSong.id;
      state.selectedChartIdx = 0;
    });
  });

  it("renders", () => {
    mount(GameplayScreen, {});
  });
});
