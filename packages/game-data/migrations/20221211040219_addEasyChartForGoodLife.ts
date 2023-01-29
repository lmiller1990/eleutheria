import { Knex } from "knex";

const notes = `010000
000000
000000
000000`;

export async function up(knex: Knex) {
  return knex("charts").insert({
    id: 11,
    difficulty: "easy",
    level: 1,
    song_id: 1, // Good Life
    notes,
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex("charts").where("id", 11).delete();
}
