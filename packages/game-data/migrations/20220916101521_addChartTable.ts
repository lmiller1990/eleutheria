import { Knex } from "knex";

const tempChart = `001000
000100
001000
000100`;

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("charts", (table) => {
    table.increments("id");
    table.text("difficulty").notNullable();
    table.integer("level").notNullable();
    table.text("notes").notNullable().defaultTo(tempChart);
    table.integer("song_id");
    table.foreign("song_id").references("id").inTable("songs");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("charts");
}
