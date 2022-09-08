import { knex as _knex } from "knex";

export const knex = _knex({
  client: "pg",
  debug: true,
  connection: {
    user: "lachlan",
    database: "rhythm",
  },
});
