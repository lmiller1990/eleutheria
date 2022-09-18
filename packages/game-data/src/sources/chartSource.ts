import { parseChart, parseHoldsChart } from "@packages/chart-parser";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";

const log = debug(`game-data:chartSource`);

export interface ChartDataDefinition {
  id: number;
  difficulty: string;
  level: number;
  notes: string;
  bpm: number;
}

export class ChartDataSource {
  #ctx: Context;
  data: ChartDataDefinition;

  constructor(ctx: Context, data: ChartDataDefinition) {
    this.#ctx = ctx;
    this.data = data;
  }

  get difficulty() {
    return this.data.difficulty;
  }

  get id() {
    return this.data.id;
  }

  get level() {
    return this.data.level;
  }

  get bpm() {
    return this.data.bpm;
  }

  get tapNoteCount() {
    return this.parsedTapNoteChart.length;
  }

  get parsedTapNoteChart() {
    // @ts-ignore
    return parseChart({ bpm: this.data.bpm }, this.data.notes).tapNotes;
  }
}
