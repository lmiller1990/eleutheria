import { debug } from "../../util/debug";
import { Context } from "../graphql/context";
import { summarizeResults, SummaryData } from "@packages/engine/scoring";
import { timingWindows } from "@packages/types";
import { knexTable } from "../knex";
import { Scores } from "../../ dbschema";

const log = debug(`game-data:actions:gameplay`);

export class GameplayActions {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  async saveScore(summaryData: SummaryData, chartId: number) {
    const user = await this.#ctx.queryForCurrentUser();

    if (!user) {
      throw Error("Cannot save score without an associated user.");
    }

    const result = summarizeResults(summaryData, timingWindows);

    const data: Omit<Scores, "id"> = {
      percent: result.percent,
      timing: JSON.stringify(result.timing),
      chart_id: chartId,
      user_id: user.id,
    };

    log("inserting", data);

    const [insertResult] = await knexTable("scores")
      .insert(data)
      .returning<[{ id: number }]>("id");

    log(`inserted with id`, insertResult);

    const inserted = await knexTable("scores")
      .where({ id: insertResult.id })
      .first()
      .select("id", "percent", "timing");

    log("returning score", inserted);

    return {
      ...inserted,
      timing: JSON.stringify(inserted.timing),
    } as unknown as {
      id: number;
      percent: string;
      timing: string;
    };
  }
}
