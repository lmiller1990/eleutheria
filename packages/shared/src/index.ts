import type {
  ChartMetadata,
  ParsedHoldNoteChart,
  ParsedTapNoteChart,
} from "@packages/chart-parser";
import type { Chart } from "@packages/frontend/src/types";

export const difficulties = ["basic", "standard", "expert"] as const;

export type Difficulty = typeof difficulties[number];

interface WebSocketChartUpdatedMessage {
  type: "editor:chart:updated";
  data: LoadSongData;
}

export type WebSocketEmitData = WebSocketChartUpdatedMessage;

export interface LoadSongData {
  charts: Array<{
    difficulty: string;
    level: number;
    parsedTapNoteChart: ParsedTapNoteChart;
    parsedHoldNoteChart: ParsedHoldNoteChart;
  }>;
  metadata: ChartMetadata;
}

export interface BaseSong extends ChartMetadata {
  id: string;
  charts: Chart[];
}

export interface ChartSummary {
  totalNotes: number;
  holdNotes: number;
  chords: {
    twoNoteCount: number;
    threeNoteCount: number;
    fourNoteCount: number;
    fiveNoteCount: number;
    sixNoteCount: number;
  };
}

export interface PersonalBest {
  percent: number;
  date: string;
}

export interface NoteSkin {
  name: string;
  css: string;
}

export interface Cover {
  id: string;
  name: string;
  thumbnailColor: string;
  css: string;
  code: string;
}

export interface ParamData {
  file: string;
  songId: string;
  chartId: string;
}

export interface UserScripts {
  css: string;
  js: string;
}

export * from "./scoring";

export * from "./utils";

export interface AudioData {
  audioContext: AudioContext;
  audioBuffer: AudioBuffer;
}
