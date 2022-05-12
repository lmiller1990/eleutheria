import type { ChartMetadata } from "@packages/chart-parser";
import type { Chart } from "@packages/frontend/src/types";

export const difficulties = ["basic", "standard", "expert"] as const;

export type Difficulty = typeof difficulties[number];

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
