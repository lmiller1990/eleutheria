import { Summary } from "@packages/engine";

export type SongCompleted = (summary: Summary) => void;

export type ScrollDirection = "up" | "down";

export type UpdateSummary = (summary: Summary) => void;
