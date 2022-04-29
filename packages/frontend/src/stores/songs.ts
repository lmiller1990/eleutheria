import { BaseSong } from "@packages/types";
import { defineStore } from "pinia";
import { Song } from "../types";

interface SongsState {
  songs: Song[];
  selectedSongId: string | undefined;
}

export const useSongsStore = defineStore("songs", {
  state(): SongsState {
    return {
      songs: [],
      selectedSongId: undefined,
    };
  },

  actions: {
    setSelectedSong(selectedSongId: string) {
      this.selectedSongId = selectedSongId;
    },

    setSongs(songs: Song[]) {
      this.songs = songs;
    },

    async fetchSongs() {
      const res = await window.fetch("http://localhost:8000/songs");
      const data = (await res.json()) as BaseSong[];

      let _songs: Song[] = [];

      for (let i = 0; i < 20; i++) {
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
