import { Scores } from "../../ dbschema";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";
import { knexTable } from "../knex";

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
    return this.data.timing as string;
  }

  async chart() {
    const chart = await this.#ctx.actions.db.queryChartById(this.data.chart_id);
    log(`got chart for score id: ${this.id}`, chart);
    return chart;
  }
}
