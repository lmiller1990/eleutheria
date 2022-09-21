import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("scores", (table) => {
    table.increments("id");
    table.text("percent").notNullable();
    table.json("timing").notNullable();
    table.integer("user_id");
    table.foreign("user_id").references("id").inTable("users");
    table.integer("chart_id");
    table.foreign("chart_id").references("id").inTable("charts");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("scores");
}
