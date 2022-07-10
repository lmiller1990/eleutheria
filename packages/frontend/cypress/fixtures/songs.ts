import type { Chart, Song } from "../../src/types";
import { thumbails } from "../../src/thumbnails";
import { ChartMetadata } from "@packages/chart-parser";
import { LoadSongData } from "@packages/game-data";

export const metadata: ChartMetadata = {
  banner: thumbails[0],
  offset: 0,
  title: "Test Song",
  artist: "Some Artist",
  charts: [],
  bpm: 120,
};

const chart: Chart = {
  difficulty: "expert",
  level: 8,
  parsedHoldNoteChart: {
    metadata,
    holdNotes: [],
  },
  parsedTapNoteChart: {
    metadata,
    tapNotes: [],
  },
};

export const testSong: Song = {
  order: 0,
  offset: 0,
  title: "Test Song",
  banner: thumbails[0],
  id: "1",
  artist: "Some Artist",
  charts: [chart],
  bpm: 120,
};

export const songData: LoadSongData = {
  ...testSong,
  metadata,
};
