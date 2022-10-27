import { Context } from "../graphql/context";
import { GraphQLDataSource } from "./graphql";
import { HtmlDataSource } from "./htmlDataSource";

export class DataSources {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  get html() {
    return new HtmlDataSource(this.#ctx);
  }

  get graphql() {
    return new GraphQLDataSource(this.#ctx);
  }
}
