import type { BaseSong } from "@packages/types/src";
import { defineStore } from "pinia";
import { getGameDataUrl } from "../screens/gameplay/env";
import type { Chart, Song } from "../types";

interface SongsState {
  originalSongs: BaseSong[];
  songs: Song[];
  selectedSongId: string | undefined;
  selectedChartIdx: number;
}

export const useSongsStore = defineStore("songs", {
  state: (): SongsState => {
    return {
      selectedSongId: undefined,
      selectedChartIdx: 0,
      originalSongs: [],
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

      let _songs: Song[] = [];
      const _offset = 0;
      this.originalSongs = data;

      for (let i = _offset; i < data.length * 6 + _offset; i++) {
        const s = data[i % data.length];
        _songs.push({
          ...s,
          order: i,
        });
      }

      this.songs = _songs;
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
