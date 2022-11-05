import { knex as _knex } from "knex";
import type { TableTypes } from "../ dbschema";

export const knex = _knex({
  client: "pg",
  // it's correct
  connection: {
    user: process.env.POSTGRES_USER ?? "lachlan",
    database: process.env.POSTGRES_DB ?? "eleutheria",
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: 5432,
  },
  // debug: true,
});

export const knexTable = <T extends {}>(
  tableName: Exclude<
    keyof TableTypes,
    "knex_migrations" | "knex_migrations_lock"
  >
) => knex<T>(tableName);
