import { Charts } from "../../ dbschema";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";

const log = debug(`game-data:ChartDataSource`);

export class ChartDataSource {
  #ctx: Context;
  data: Charts;

  constructor(ctx: Context, data: Charts) {
    log("Created ChartDataSource", data);
    this.#ctx = ctx;
    this.data = data;
  }
}
