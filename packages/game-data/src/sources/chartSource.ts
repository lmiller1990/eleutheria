import { parseChart, parseHoldsChart } from "@packages/chart-parser";
import { Charts } from "../../ dbschema";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";

const log = debug(`game-data:chartSource`);

export interface ChartDataDefinition extends Charts {
  bpm: number;
  offset: number;
}

// TODO: Not a source?
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

  get offset() {
    console.log('offset is', this.data.offset)
    return this.data.offset;
  }

  get tapNoteCount() {
    return this.parsedTapNoteChart.length;
  }

  get parsedTapNoteChart() {
    return parseChart({ bpm: this.bpm, offset: this.offset }, this.data.notes).tapNotes;
  }
}
