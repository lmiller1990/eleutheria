import { defineStore } from "pinia";

interface SongsState {
  selectedSongId: number | undefined;
  selectedChartIdx: number;
}

export const useSongsStore = defineStore("songs", {
  state: (): SongsState => {
    return {
      selectedSongId: undefined,
      selectedChartIdx: 2,
    };
  },

  actions: {
    setSelectedSongId(selectedSongId: number) {
      this.selectedSongId = selectedSongId;
    },

    setSelectedChartIdx(selectedChartIdx: number) {
      this.selectedChartIdx = selectedChartIdx;
    },
  },
});
