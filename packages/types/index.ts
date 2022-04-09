import type { ChartMetadata } from "@packages/chart-parser";

export const difficulties = ["basic", "standard", "expert"] as const;

export type Difficulty = typeof difficulties[number];

export interface Chart {
  difficulty: Difficulty;
  level: number;
}

export interface BaseSong extends ChartMetadata {
  id: string;
  charts: Chart[];
}

export interface ChartSummary {
  tapNotes: number;
  holdNotes: number;
  durationSeconds: number;
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
