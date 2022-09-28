import { knex as _knex } from "knex";
import type { TableTypes } from "../ dbschema";

export const knex = _knex({
  client: "pg",
  // debug: true,
  connection: {
    user: process.env.POSTGRES_USER ?? "lachlan",
    database: process.env.POSTGRES_DB ?? "rhythm",
  },
});

export const knexTable = <T extends {}>(
  tableName: Exclude<
    keyof TableTypes,
    "knex_migrations" | "knex_migrations_lock"
  >
) => knex<T>(tableName);
