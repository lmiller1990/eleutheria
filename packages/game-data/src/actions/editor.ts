import assert from "assert";
import fs from "fs-extra";
import path from "path";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";

const log = debug(`game-data:actions:editor`);

export class EditorActions {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  async copyChartToFile(chartId: number): Promise<void> {
    log("editing chart");
    const chart = await this.#ctx.actions.db.queryChartById(chartId);
    assert(chart, `Could not find chart with id ${chartId}`);
    const dir = path.join(__dirname, "..", "..", "tmp", "editing.txt");
    await fs.writeFile(dir, chart.data.notes, "utf8");
  }
}
