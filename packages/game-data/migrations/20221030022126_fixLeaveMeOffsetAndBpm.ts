import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex("songs")
    .update({
      offset: 1682,
      bpm: 180,
    })
    .where("title", "=", "Leave me");
}

export async function down(knex: Knex): Promise<any> {
  return knex("songs")
    .update({
      offset: 0,
      bpm: 175,
    })
    .where("title", "=", "Leave me");
}
