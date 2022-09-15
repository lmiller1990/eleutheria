import { Request, Response } from "express";
import { knex, knexTable } from "../knex";
import { DataActions } from "../actions";
import { DataSources } from "../sources";
import { Users } from "../../ dbschema";

export class Context {
  req: Request;
  res: Response;
  actions = new DataActions(this);
  sources = new DataSources(this);

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  async viewer() {
    const user = await knexTable("sessions")
      .where({ "sessions.id": this.req.session?.id })
      .join("users", "users.id", "=", "sessions.user_id")
      .first<Users>();

    if (!user) {
      return null;
    }

    return { ...user, id: user.id.toString() };
  }

  get app() {
    return {
      books: [{ title: "Some title", year: 1980, author: "Lachlan" }],
    };
  }
}
