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
