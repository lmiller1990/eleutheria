export const difficulties = ["basic", "standard", "expert"] as const;

export type Difficulty = typeof difficulties[number];

export interface Chart {
  difficulty: Difficulty;
  level: number;
}

export interface BaseSong {
  id: string;
  bpm: number;
  title: string;
  charts: Chart[];
}
