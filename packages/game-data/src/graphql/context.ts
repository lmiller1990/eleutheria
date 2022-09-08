import { Request, Response } from "express";
import type { Client } from "pg";
import { knex } from "../knex";
import { DB } from "../../";

export class Context {
  req: Request;
  res: Response;
  #db: Client;

  constructor(req: Request, res: Response, db: Client) {
    this.req = req;
    this.res = res;
    this.#db = db;
  }

  async viewer() {
    console.log(this.req.session.id);
    const user = await knex("sessions")
      .where({ "sessions.id": this.req.session.id })
      .join("users", "users.id", "=", "sessions.user_id")
      .first<DB.User>();
    return user;
  }

  get app() {
    return {
      books: [{ title: "Some title", year: 1980, author: "Lachlan" }],
    };
  }
}
