import type { BaseSong } from "@packages/types/src";
import { defineStore } from "pinia";
import type { Chart, Song } from "../types";

interface SongsState {
  songs: Song[];
  selectedSongId: string | undefined;
  selectedChartIdx: number;
}

export const useSongsStore = defineStore("songs", {
  state: (): SongsState => {
    return {
      selectedSongId: undefined,
      selectedChartIdx: 0,
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
      const res = await window.fetch("http://localhost:8000/songs");
      const data = (await res.json()) as BaseSong[];

      let _songs: Song[] = [];
      const _offset = 3;

      for (let i = _offset; i < 20 + _offset; i++) {
        const s = data[i % data.length];
        _songs.push({
          ...s,
          order: i,
          title: `#${i}: ${s.title}`,
          key: i.toString(),
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
