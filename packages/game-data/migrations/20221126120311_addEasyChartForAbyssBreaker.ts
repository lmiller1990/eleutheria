import { Knex } from "knex";

const notes = `001000
000000
000000
000000
,     
000000
000000
000000
000000
,     
000100
000000
000000
000000
,     
000000
000000
000000
000000
,     
010000
000000
000000
000000
,     
000000
000000
000000
000000
,     
000010
000000
000000
000000
,     
000000
000000
000000
000000
,     
001000
000000
000000
000000
,     
000000
000000
000000
000000
,     
000001
000000
000000
000000
,     
000000
000000
000000
000000
,     
100000
000000
000000
000000
,     
000000
000000
000000
000000
,     
000100
000000
000000
000000
,     
001000
000000
000000
000000
,     
000000
000000
000000
000000
,     
000000
000000
000000
000000
,     
000010
000000
000000
000000
,     
000010
000000
000000
000000
,     
010000
000000
000000
000000
,     
010000
000000
000000
000000
,     
000100
000000
000000
000000
,     
001000
000000
000000
000000
,     
000001
000000
000000
000000
,     
100000
000000
000000
000000
,     
000100
000000
000100
000000
,     
001000
000000
001000
000000
,     
000010
000000
000010
000000
,     
010000
000000
010000
000000
,     
000010
000000
000000
000000
,     
010000
000000
000000
000000
,     
000001
000000
000000
000000
,     
100000
000000
000000
000000
,     
000100
000000
000100
000000
,     
000100
000000
000100
000000
,     
001000
000000
001000
000000
,     
001000
000000
001000
000000
,     
000001
000000
000001
000000
,     
000001
000000
000001
000000
,     
010000
000000
010000
000000
,     
010000
000000
010000
000000
,     
000001
000000
000000
000000
,     
100000
000000
000000
000000
,     
000001
000000
000000
000000
,     
100000
000000
000000
000000
,     
000010
000000
000000
000000
,     
000010
000000
000000
000000
,     
001000
000000
000000
000000
,     
001000
000000
000000
000000
,     
000100
000000
000000
000000
,     
010000
000000
000000
000000
,     
000010
000000
000000
000000
,     
001000
000000
000000
000000
,     
000100
000000
000000
000000
,     
010000
000000
000000
000000
,     
000010
000000
000000
000000
,     
001000
000000
000000
000000
,     
000010
000000
000000
000000
,     
001000
000000
000000
000000
,     
000100
000000
000000
000000
,     
100000
000000
000000
000000
,     
000010
000000
000000
000000
,     
010000
000000
000000
000000
,     
000001
000000
000000
000000
,     
010000
000000
010000
000000
,     
000100
000000
000100
000000
,     
100000
000000
100000
000000
,     
000010
000000
000010
000000
,     
010000
000000
000000
000000
,     
000001
000000
000000
000000
,     
010000
000000
000000
000000
,     
000100
000000
000000
000000
,     
100000
100000
100000
000000
,     
000010
000010
000010
000000
,     
001000
000000
001000
000000
,     
000001
000000
000001
000000
,     
010000
000000
000000
000000
,     
000010
000000
000000
000000
,     
100000
000000
000000
000000
,     
000100
000000
000000
000000
,     
001000
001000
001000
000000
,     
000010
000010
000010
000000
,     
100000
100000
100000
000000
,     
000100
000100
000100
000000
,     
010000
010000
010000
000000
,     
000010
000000
000000
000000
,     
001000
000000
000000
000000
,     
000100
000000
000000
000000
,     
010000
000000
000000
000000
,     
000010
000000
000000
000000
,     
100000
000000
000000
000000
,     
000100
000000
000000
000000
,     
001000
000000
000000
000000
,     
000001
000000
000000
000000
,     
010000
010000
010000
000000
,     
000100
000100
000100
000000
,     
100000
100000
100000
000000
,     
000010
000010
000010
000000
,     
001000
001000
001000
000000
,     
000001
000001
000001
000000
,     
100000
000000
000000
000000
,     
000010
000000
000000
000000
,     
010000
000000
000000
000000
,     
000001
000000
000000
000000
,     
001000
000000
000000
000000
,     
000010
000000
000000
000000
,     
100000
000000
000000
000000
,     
000100
000000
000000
000000`;

export async function up(knex: Knex) {
  return knex("charts").insert({
    id: 8,
    difficulty: "easy",
    level: 1,
    song_id: 4, // Abyss Breaker
    notes,
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex("charts").where("id", 8).delete();
}
