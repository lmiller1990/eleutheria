import { Knex } from "knex";

export async function up(knex: Knex) {
  let id = 1; // good life chart is id=1
  const charts = (songId: number) =>
    [1, 4, 10, 14].map((level, idx) => {
      id++;
      return knex("charts").insert({
        id,
        difficulty: "easy",
        level,
        song_id: songId,
      });
    });

  return Promise.all([...charts(2), ...charts(3)]);
}

export async function down(knex: Knex): Promise<void> {
  return knex("charts").where({ song_id: 2 }).orWhere({ song_id: 3 }).delete();
}
