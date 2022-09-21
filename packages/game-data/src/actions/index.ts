import { Context } from "../graphql/context";
import { DbActions } from "./db";
import { GameplayActions } from "./gameplay";

export class DataActions {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  get db() {
    return new DbActions(this.#ctx);
  }

  get gameplay() {
    return new GameplayActions(this.#ctx);
  }
}
