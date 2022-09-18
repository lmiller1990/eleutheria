import type { BaseSong } from "@packages/types";
import { defineStore } from "pinia";
import type { Chart, Song } from "../types";

interface SongsState {
  songs: Song[];
  selectedSongId: number | undefined;
  selectedChartIdx: number;
}

export const useSongsStore = defineStore("songs", {
  state: (): SongsState => {
    return {
      selectedSongId: undefined,
      selectedChartIdx: 2,
      songs: [],
    };
  },

  actions: {
    setSelectedSongId(selectedSongId: number | undefined) {
      this.selectedSongId = selectedSongId;
    },

    setSongs(songs: Song[]) {
      this.songs = songs;
    },

    async fetchSongs() {
      const res = await window.fetch("/songs");
      const data = (await res.json()) as BaseSong[];
      console.log(data);

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
