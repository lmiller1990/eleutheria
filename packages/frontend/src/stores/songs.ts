import type { BaseSong } from "@packages/types";
import { defineStore } from "pinia";
import { getGameDataUrl } from "../screens/gameplay/env";
import type { Chart, Song } from "../types";

interface SongsState {
  songs: Song[];
  selectedSongId: string | undefined;
  selectedChartIdx: number;
}

export const useSongsStore = defineStore("songs", {
  state: (): SongsState => {
    return {
      selectedSongId: "good-life",
      selectedChartIdx: 2,
      songs: [],
    };
  },

  actions: {
    setSelectedSongId(selectedSongId: string) {
      this.selectedSongId = selectedSongId;
    },

    setSongs(songs: Song[]) {
      this.songs = songs;
    },

    async fetchSongs() {
      const res = await window.fetch(getGameDataUrl("/songs"));
      const data = (await res.json()) as BaseSong[];

      this.songs = data.map<Song>((song, idx) => {
        return {
          ...song,
          order: idx,
        };
      });
    },

    setSelectedChartIdx(selectedChartIdx: number) {
      this.selectedChartIdx = selectedChartIdx;
    },
  },

  getters: {
    selectedSong(state): Song | undefined {
      return state.songs.find((x) => x.id === state.selectedSongId);
    },
    selectedChart(state): Chart | undefined {
      return this.selectedSong?.charts[state.selectedChartIdx];
    },
  },
});
