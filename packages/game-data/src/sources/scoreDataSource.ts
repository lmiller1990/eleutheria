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
    console.log("Query for chart by id", this.data.chart_id);
    const chart = await this.#ctx.actions.db.queryChartById(this.data.chart_id);
    log(`got chart for score id: ${this.id}`, chart);
    assert(chart, "score must have a chart");
    return chart;
  }
}
