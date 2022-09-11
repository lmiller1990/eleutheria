import { Context } from "../graphql/context";
import { DbActions } from "./db";

export class DataActions {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  get db() {
    return new DbActions(this.#ctx);
  }
}
