import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("scores", (table) => {
    table.increments("id");
    table.float("percent").notNullable();
    table.json("timing").notNullable();
    table.integer("user_id").notNullable();
    table.foreign("user_id").references("id").inTable("users");
    table.integer("chart_id").notNullable();
    table.foreign("chart_id").references("id").inTable("charts");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("scores");
}
