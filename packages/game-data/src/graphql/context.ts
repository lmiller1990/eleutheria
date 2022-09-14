import { Request, Response } from "express";
import { knex } from "../knex";
import { DB } from "../../";
import { DataActions } from "../actions";
import { DataSources } from "../sources";

export class Context {
  req: Request;
  res: Response;
  actions = new DataActions(this);
  sources = new DataSources(this);

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  get knex() {
    return knex;
  }

  async viewer() {
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
