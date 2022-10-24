import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("covers", (table) => {
    table.increments("id");
    table.text("name").notNullable().unique();
    table.text("thumbnail_color").notNullable();
    table.text("css").notNullable().defaultTo("/* no css */");
    table.text("code").notNullable().defaultTo("/* no-op */");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("covers");
}
