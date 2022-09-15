import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("songs", (table) => {
    table.text("id").notNullable().unique();
    table.text("title").notNullable();
    table.text("duration").notNullable();
    table.text("artist").notNullable();
    table.integer("offset").notNullable();
    table.integer("bpm").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("songs");
}
