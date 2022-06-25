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
      this.originalSongs = data;

      for (let i = 0; i < data.length; i++) {
        const s = data[i % data.length];
        _songs.push({
          ...s,
          order: i,
        });
      }

      for (let i = 0; i < 3; i++) {
        _songs.push({..._songs[i], id: i.toString(), order: _songs[i].order + 1 })
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
