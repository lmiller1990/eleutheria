import { Knex } from "knex";

export async function up(knex: Knex) {
  return Promise.all([
    knex("songs").insert({
      id: "2",
      title: "Rune Delta",
      duration: "2:04",
      bpm: 190,
      artist: "seatrus",
      offset: 0,
    }),
    knex("songs").insert({
      id: "3",
      title: "Leave me",
      duration: "2:35",
      bpm: 175,
      artist: "RuYA",
      offset: 0,
    }),
  ]);
}

export async function down(knex: Knex): Promise<void> {
  return knex("songs").where({ id: 2 }).orWhere({ id: 3 }).delete();
}
