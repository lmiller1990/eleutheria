import { Summary } from "@packages/engine";

export type SongCompleted = (summary: Summary) => void;

export interface GameplayModifiers {
  speed: number;
  scroll: "up" | "down";
}

export type UpdateSummary = (summary: Summary) => void;
