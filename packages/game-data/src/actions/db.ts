import { DB } from "../..";
// import debugLib from "debug";
import { knex } from "../knex";

// const debug = debugLib("rhythm:game-data:actions:db");

export class DbActions {
  //
  async createUser({
    username,
    email,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }) {
    try {
      const user = await knex("users").insert<DB.User>({ username, email, password });
      console.log("created user %o", user);
      return user
    } catch (e) {
      console.log("error creating user %o", e);
    }
  }
}
