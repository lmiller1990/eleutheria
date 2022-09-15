import { Songs, Users } from "../../ dbschema";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";
import { knexTable } from "../knex";

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
  }): Promise<Users | undefined> {
    try {
      const user = await knexTable("users").insert<Users>({
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
    const user = await knexTable("users").where<Users>("email", email).first();
    return user;
  }

  async signIn(email: string, password: string) {
    log(this.#ctx.req.session.id);

    const user = await this.findUserByEmail(email);

    if (!user || user.password !== password) {
      throw Error("Credentials do not match.");
    }

    await knexTable("sessions")
      .where({ id: this.#ctx.req.session.id })
      .update({ user_id: user.id });

    return user;
  }

  async queryForSongs() {
    const songs = await knexTable<Songs>("songs").select();
    return songs;
  }

  async signOut() {
    await knexTable("sessions")
      .where({ id: this.#ctx.req.session.id })
      .delete();

    log(`deleted session with id ${this.#ctx.req.session.id}`);
  }
}
