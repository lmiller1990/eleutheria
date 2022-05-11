import type { BaseSong } from "@packages/types/src";
import { defineStore } from "pinia";
import type { Song } from "../types";

interface SongsState {
  songs: Song[];
}

export const useSongsStore = defineStore("songs", {
  state: (): SongsState => {
    return {
      songs: [],
    };
  },

  actions: {
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
  },
});
