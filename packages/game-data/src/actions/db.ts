import { DB } from "../..";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";
import { knex } from "../knex";

const log = debug(`game-data:db`);

export class DbActions {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  async createUser({
    username,
    email,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }): Promise<DB.User | undefined> {
    try {
      const user = await knex("users").insert<DB.User>({
        username,
        email,
        password,
      });
      log("created user", user);
      return user;
    } catch (e) {
      log("error creating user", e);
    }

    return;
  }

  async findUserByEmail(email: string) {
    const user = await knex("users").where<DB.User>("email", email).first();
    return user;
  }

  async signIn(email: string, password: string) {
    log(this.#ctx.req.session.id);

    const user = await this.findUserByEmail(email);

    if (!user) {
      return;
    }

    if (user.password === password) {
      await knex("sessions")
        .where({ id: this.#ctx.req.session.id })
        .update({ user_id: user.id });
    }

    return user;
  }

  async signOut() {
    await knex("sessions").where({ id: this.#ctx.req.session.id }).delete();

    log(`deleted session with id ${this.#ctx.req.session.id}`);
  }
}
