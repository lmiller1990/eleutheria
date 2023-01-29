import { Knex } from "knex";

const notes = `000000
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
001000
000000
001000
010000
000000
000100
000000
010000
000000
000100
010000
000000
000010
,
001000
000000
000000
000100
000000
000100
100000
000000
000001
000000
100000
000000
000001
000000
000000
000000
,
010000
000000
000100
001000
000010
000000
010000
000010
001000
000000
000010
010000
000100
100000
000000
100000
,
000010
000000
001000
000100
010000
000001
000001
010000
000100
000000
001000
000000
000100
100000
000000
100000
,
000010
000000
001000
000100
010000
000000
000010
010000
000100
000000
010000
000010
001000
000001
000000
000001
,
010000
000000
000100
001000
000010
100000
100000
000010
001000
000000
000100
010000
000100
000000
000100
000000
,
010010
000000
010000
000001
000000
001000
000010
000010
010000
000100
001000
000100
011000
000000
000100
001000
,
001010
000000
000100
100000
000000
100000
000001
000000
001000
000001
001000
000010
000100
000000
000100
000010
,
001100
000000
001000
000100
000000
100000
000001
000001
001000
000010
100000
000010
101000
000000
000010
100000
,
100001
000000
000010
010000
000000
010000
000100
000000
100000
000100
100000
000001
000010
000000
000010
000001
,
010010
000000
000010
100000
000000
001000
010000
010000
000010
000100
001000
000100
001010
000000
000100
001000
,
011000
000000
000100
000001
000000
000001
100000
000000
001000
100000
001000
010000
000100
000000
000100
010000
,
001100
000000
001000
000100
000000
000001
100000
100000
001000
010000
000001
010000
001001
000000
010000
000001
,
100001
000000
010000
000010
000000
000010
000100
000000
001000
000010
010000
000010
001000
000000
000000
000000
,
000100
000000
100000
000010
000000
001000
000000
000001
,
000000
000000
000000
000000
000000
000000
000100
000000
000000
000000
001000
000000
000001
000010
000100
000000
,
000000
000000
000000
001000
000100
010000
000000
000101
,
000000
000010
100000
000100
000000
000000
000000
000000
,
001100
000000
001000
000010
001000
000000
000100
010000
000100
000000
100000
000010
100000
000000
000001
000000
,
010000
000000
000001
000000
001000
000000
000100
000000
100000
000000
000001
010000
000100
100000
000010
000000
,
001000
000100
001000
000100
010000
000100
010000
000100
001000
000010
001000
000010
010000
000001
010000
000001
,
100000
000100
001000
000100
010000
000100
001000
000100
010000
000100
001000
000100
011000
000000
000000
000000
,
000100
000000
001000
000000
000010
000000
010000
000000
000100
000000
100000
000000
000110
000000
000000
000000
000000
000000
000000
000000
000000
001000
000000
000000
000000
000000
000000
001000
000000
000000
000001
000000
000000
010000
000000
000000
001000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
,
000100
000000
000000
100000
000000
000000
000000
000000
000000
000100
000000
000000
000001
000000
000000
000000
001000
000000
000100
000000
000000
010000
000000
000000
000010
000000
000000
000000
000000
000000
000010
000000
000000
001000
000000
000000
000000
000000
000000
001000
000000
000000
000100
000000
000000
000000
000000
000000
,
100000
000000
000000
000100
010100
000000
010000
000010
000000
000100
001000
010000
000000
000100
001000
000001
,
000000
001000
000100
001000
010000
000000
000000
001000
000110
000010
000000
010000
000000
000010
000010
000000
,
001000
000000
000100
000000
010000
000000
000010
000000
001000
000000
000001
000000
011000
000000
000000
000000
000000
000000
000000
000000
000000
000010
000000
000000
000000
000000
000000
000010
000000
000000
010000
000000
000000
000001
000000
000000
000010
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
,
100000
000000
000000
000100
000000
000000
000000
000000
000000
100000
000000
000000
010000
000000
000000
000000
000010
000000
100000
000000
000000
000001
000000
000000
001000
000000
000000
000000
000000
000000
001000
000000
000000
000010
000000
000000
000000
000000
000000
000010
000000
000000
100000
000000
000000
000000
000000
000000
,
000100
000000
000000
000000
000000
000000
000000
000000
000000
100000
000000
000000
100001
000000
000000
000000
000000
000000
000001
000000
000000
001000
000000
000000
000010
000000
100000
000000
000010
000000
001000
000000
000100
000000
010000
000000
000010
000000
000000
100000
000000
000000
000010
000000
000000
010000
000000
000000
,
000100
000000
000000
001000
000110
010000
000000
000001
000000
000001
000001
000000
011110
000000
011110
000000
,
000100
000000
001000
000000
010000
000000
000010
000000
000100
000000
000001
000000
010100
000000
000000
000000
000000
000000
000000
000000
000000
001000
000000
000000
000000
000000
000000
001000
000000
000000
100000
000000
000000
000010
000000
000000
001000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
,
000100
000000
000000
000001
000000
000000
000000
000000
000000
000100
000000
000000
100000
000000
000000
000000
001000
000000
000100
000000
000000
000010
000000
000000
010000
000000
000000
000000
000000
000000
010000
000000
000000
001000
000000
000000
000000
000000
000000
001000
000000
000000
000100
000000
000000
000000
000000
000000
,
000001
000000
000000
000100
000110
000000
000010
010000
000000
000100
001000
000010
000000
000100
001000
100000
,
000000
001000
000100
001000
000010
000000
000000
001000
010100
010000
000000
000010
000000
010000
010000
000000
,
001000
000000
000100
000000
000010
000000
010000
000000
001000
000000
100000
000000
001010
000000
000000
000000
000000
000000
000000
000000
000000
010000
000000
000000
000000
000000
000000
010000
000000
000000
000010
000000
000000
100000
000000
000000
010000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
,
000001
000000
000000
000100
000000
000000
000000
000000
000000
000001
000000
000000
000010
000000
000000
000000
010000
000000
000001
000000
000000
100000
000000
000000
001000
000000
000000
000000
000000
000000
001000
000000
000000
010000
000000
000000
000000
000000
000000
010000
000000
000000
000001
000000
000000
000000
000000
000000
,
101100
000000
000000
000010
001000
000100
100000
000010
001110
000000
000000
111000
000000
000000
000111
000000
,
000000
001000
001000
001000
001000
001000
001000
000000
,
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000010
000100
000000
000000
000000
000000
000010
000000
000000
000000
000000
000000
001000
000000
000000
000000
000000
000000
000000
000000
000000
000001
000000
000000
000000
000000
000000
000000
000000
000000
100000
000000
000000
000000
000000
000000
,
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000010
000100
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
010000
000000
000000
000000
000000
000000
000001
000000
000000
000010
000000
000000
000100
000000
000000
000000
000000
000000
,
000000
000000
000000
000000
001000
000000
000100
000000
100000
000000
000000
010000
000000
000000
000001
000000
,
000000
000000
000000
000000
000000
000000
010000
001000
000000
000000
000000
000000
000010
000000
000000
000000
000000
000000
100000
001000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
,
000100
000000
000000
000000
000000
000000
001000
000000
000000
000000
000000
000000
010000
001000
000000
000000
000000
000000
010000
000000
000000
000000
000000
000000
000100
000000
000000
000000
000000
000000
100000
000000
000000
000010
000000
000000
100000
000000
000000
000000
000000
000000
000001
000000
000000
010000
000000
000000
,
000001
000000
000000
000000
000000
000000
100000
000000
000000
000100
000000
000000
100000
000000
000000
000000
000000
000000
000010
000100
000000
000000
000000
000000
010000
000000
000000
000000
000000
000000
000010
000000
000000
000000
000000
000000
100000
000000
000000
010000
000000
000000
001000
000000
000000
000100
000000
000000
,
001000
000000
000000
000000
000000
000000
000100
000000
000000
100000
000000
000000
000100
000000
000000
000000
000000
000000
001000
000000
000000
000001
000000
000000
010000
000000
000000
000000
000000
000000
000010
000000
000000
100000
000000
000000
000100
000000
000000
000000
000000
000000
010000
001000
000000
000000
000000
000000
,
000010
000000
001000
000000
000001
000000
100000
000000
000100
000000
000000
001000
001100
000000
001100
000000
,
100110
000000
000000
010000
000000
000100
001110
000000
000000
000000
011100
000000
000000
011100
000000
000000
,
001101
000000
000000
100000
000000
000100
101100
000000
000000
000000
101100
000000
000000
101100
000000
000000
,
001110
000000
000000
000001
000000
100000
011010
000000
000000
000000
011010
000000
000000
011010
000000
000000
,
100110
000000
000000
100000
000000
000001
001110
000000
000000
000000
001110
000000
010000
000000
000000
000000
,
000110
001000
000010
001000
000100
010000
000100
010000
000001
001000
000001
001000
000100
100000
000100
100000
,
000110
010000
000010
001000
000100
010000
000101
001000
000010
010000
000100
100000
000001
001000
000100
001000
,
000100
001000
000100
001000
000010
001000
000100
010000
000100
010000
000010
010000
000001
001000
000001
100000
000100
100000
000010
001000
000010
010000
000100
010000
,
000001
000000
000000
000000
001000
000000
000000
000100
000000
001000
000100
000000
001100
000000
000000
000000
,
011000
000000
000100
000000
010000
000000
000100
000000
001000
000000
000010
000000
010010
000000
000000
000000
000000
000000
010000
000000
000000
000000
000000
000000
000100
000000
000000
001000
000000
000000
000000
000000
000000
000010
000000
000000
011000
000000
000000
000100
000000
000000
000001
000000
000000
000000
000000
000000
,
001000
000100
000000
100000
000010
000010
001000
000000
000001
000100
000010
100000
001000
010000
000000
000000
,
000100
000000
000000
000000
010100
000000
000100
001000
000010
010000
000000
001000
100000
000000
000001
000000
,
001000
000010
000000
000010
010000
000100
000100
000000
100000
000000
000001
000000
000001
001000
000100
010000
,
000010
000000
001000
000000
000010
000000
001000
000000
000100
000000
010000
000000
010010
000000
000000
000000
000000
000000
000010
000000
000000
000000
000000
000000
001000
000000
000000
000100
000000
000000
000000
000000
000000
010000
000000
000000
000110
000000
000000
001000
000000
000000
100000
000000
000000
000000
000000
000000
,
000100
001000
000000
000001
001000
000000
000110
010000
000100
000000
010000
000000
000100
100000
000001
000000
,
011100
000000
000000
000100
100000
000000
000001
000000
001110
000000
000000
011100
000000
000000
011110
000000
,
000000
000100
000100
000100
000100
000100
000100
000000
,
011000
000000
000000
001000
000100
000000
100000
000000
000001
000000
010000
000000
001000
000000
000010
000000
,
001000
000000
000000
000100
001000
000001
000010
000100
001000
000010
010000
000100
100000
000001
000000
000000
,
001000
000000
000000
000000
001100
000000
000100
010000
000010
001000
000010
000100
100000
000000
000010
000000
,
011000
000000
000000
000000
000000
000000
000100
000000
000000
000000
000000
000000
001000
000000
000000
000100
000000
000000
000100
000000
000000
000000
000000
000000
011000
000000
000000
000010
000000
000000
000000
000000
000000
000000
000000
000000
100000
000000
000000
000000
000010
000000
001000
000000
000100
000000
001000
000000
,
000110
000000
000000
000100
001000
000000
000001
000000
100000
000000
000010
000000
000100
000000
010000
000000
,
000100
000000
000000
001000
000100
100000
010000
001000
000100
010000
000010
001000
000001
100000
000000
000000
,
101100
000000
000000
000100
001000
000100
010000
000000
001110
000000
000000
011100
000000
000000
011110
000000
,
000000
000010
000010
000010
000010
000010
010000
000000`;

export async function up(knex: Knex) {
  return knex("charts").insert({
    id: 12,
    difficulty: "easy",
    level: 2,
    song_id: 1, // Good Life
    notes,
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex("charts").where("id", 12).delete();
}
