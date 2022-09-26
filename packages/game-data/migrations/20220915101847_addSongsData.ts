import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex("songs").insert({
    id: "1",
    title: "Good Life",
    duration: "2:23",
    bpm: 130,
    artist: "Litmus*",
    offset: 1990,
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex("songs").where({ id: "1" }).delete();
}
