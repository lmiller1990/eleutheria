import { knex as _knex } from "knex";
import { ClientConfig } from "pg";
import type { TableTypes } from "../ dbschema";

const connection: ClientConfig = {
  user: process.env.POSTGRES_USER ?? "lachlan",
  database: process.env.POSTGRES_DB ?? "rhythm",
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: 5432,
};

if (process.env.CI) {
  console.log("Creating Knex client with", connection);
}

export const knex = _knex({
  client: "pg",
  // it's correct
  connection: connection as any,
});

export const knexTable = <T extends {}>(
  tableName: Exclude<
    keyof TableTypes,
    "knex_migrations" | "knex_migrations_lock"
  >
) => knex<T>(tableName);
