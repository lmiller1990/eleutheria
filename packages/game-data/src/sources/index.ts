import { Context } from "../graphql/context";
import { HtmlDataSource } from "./HtmlDataSource";

export class DataSources {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  get html() {
    return new HtmlDataSource(this.#ctx);
  }
}
