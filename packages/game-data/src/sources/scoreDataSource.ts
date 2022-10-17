import assert from "assert";
import { Scores } from "../../ dbschema";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";
import { ChartDataSource } from "./chartSource";

const log = debug(`game-data:ScoreDataSource`);

export interface ScoreDataDefinition extends Scores {
  percent: string;
}

export class ScoreDataSource {
  #ctx: Context;
  data: ScoreDataDefinition;

  constructor(ctx: Context, data: ScoreDataDefinition) {
    this.#ctx = ctx;
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get percent() {
    return this.data.percent;
  }

  get timing() {
    // It is JSON data
    return JSON.stringify(this.data.timing);
  }

  async chart(): Promise<ChartDataSource> {
    const chart = await this.#ctx.actions.db.queryChartById(this.data.chart_id);
    assert(
      chart,
      `score must have a chart. Looked using chart_id: ${this.data.chart_id}`
    );
    return chart;
  }
}
