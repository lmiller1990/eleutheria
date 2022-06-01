import { BaseSong } from "@packages/types/src";

export const songs: BaseSong[] = Array(10)
  .fill(undefined)
  .map((_, idx) => ({
    id: (idx + 1).toString(),
    offset: 0,
    banner: "",
    artist: "Unknown",
    bpm: 150,
    charts: [],
    title: `Test Song #${idx + 1}`,
  }));
