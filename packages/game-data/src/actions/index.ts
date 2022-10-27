import { Context } from "../graphql/context";
import { DbActions } from "./db";
import { EditorActions } from "./editor";
import { GameplayActions } from "./gameplay";
import { GraphQLActions } from "./graphql";

export class DataActions {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  get db() {
    return new DbActions(this.#ctx);
  }

  get editor() {
    return new EditorActions(this.#ctx);
  }

  get gameplay() {
    return new GameplayActions(this.#ctx);
  }

  get graphql() {
    return new GraphQLActions(this.#ctx);
  }
}
