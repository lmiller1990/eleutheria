import { BaseSong } from "@packages/types";

export const songs: BaseSong[] = Array(10)
  .fill(undefined)
  .map((_, idx) => ({
    id: (idx + 1).toString(),
    offset: 0,
    banner: "",
    bpm: 150,
    charts: [],
    title: `Test Song #${idx + 1}`,
  }));
