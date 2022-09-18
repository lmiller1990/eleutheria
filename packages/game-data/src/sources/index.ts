import { Context } from "../graphql/context";
import { ChartDataSource } from "./chartSource";
import { HtmlDataSource } from "./htmlDataSource";

export class DataSources {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  get chart() {
    return new ChartDataSource(this.#ctx);
  }

  get html() {
    return new HtmlDataSource(this.#ctx);
  }
}
