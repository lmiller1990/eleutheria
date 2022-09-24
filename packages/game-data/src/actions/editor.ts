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

  static get editingPath () {
    return path.join(__dirname, "..", "..", "tmp", "editing.txt");
  }

  async copyChartToFile(chartId: number): Promise<void> {
    log("editing chart");
    const chart = await this.#ctx.actions.db.queryChartById(chartId);
    assert(chart, `Could not find chart with id ${chartId}`);
    await fs.writeFile(EditorActions.editingPath, chart.data.notes, "utf8");
  }

  // TODO: Don't hardcode chartId
  async writeChartToDb() {
    const notes = await fs.readFile(EditorActions.editingPath, "utf8") 
    await this.#ctx.knexTable("charts").where("id", 1).update({
      notes,
    });
    return notes
  }
}
