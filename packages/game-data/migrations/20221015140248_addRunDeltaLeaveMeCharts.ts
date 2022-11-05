import { Knex } from "knex";

export async function up(knex: Knex) {
  let id = 1; // good life chart is id=1
  const charts = ({
    songId,
    chartId,
    level,
  }: {
    songId: number;
    chartId: number;
    level: number;
  }) =>
    knex("charts").insert({
      id: chartId,
      difficulty: "easy",
      level,
      song_id: songId,
    });

  return Promise.all([
    // 2 is Rune Delta
    charts({ songId: 2, chartId: 2, level: 1 }),
    charts({ songId: 2, chartId: 3, level: 5 }),
    // 3 is Leave me
    charts({ songId: 3, chartId: 4, level: 1 }),
    charts({ songId: 3, chartId: 5, level: 5 }),
  ]);
}

export async function down(knex: Knex): Promise<void> {
  return knex("charts").where({ song_id: 2 }).orWhere({ song_id: 3 }).delete();
}
