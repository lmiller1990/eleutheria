import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex("charts")
    .where({
      id: 4,
    })
    .orWhere({ id: 2 })
    .delete();
}

export async function down(knex: Knex): Promise<void> {
  await knex("charts").where("id", 15).delete();
}
