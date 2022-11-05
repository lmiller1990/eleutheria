import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex("songs").insert({
    id: 4,
    title: "Abyss Breaker",
    duration: "2:15",
    bpm: 195,
    file: "abyss_breaker.wav",
    artist: "打打だいず",
    offset: 1240,
  });

  return knex("charts").insert({
    id: 7,
    difficulty: "expert",
    level: 4,
    song_id: 4,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex("charts").where("id", 7).delete();
  return knex("songs").where("id", 4).delete();
}
