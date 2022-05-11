import {
  ParsedHoldNoteChart,
  ParsedTapNoteChart,
} from "@packages/chart-parser";
import type { BaseSong, Difficulty } from "@packages/types/src";

export interface Song extends BaseSong {
  order: number;
  banner: string;
  key: string;
}

export interface Chart {
  difficulty: Difficulty;
  level: number;
  parsedTapNoteChart: ParsedTapNoteChart;
  parsedHoldNoteChart: ParsedHoldNoteChart;
}
