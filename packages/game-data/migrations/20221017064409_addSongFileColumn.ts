import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("songs", (table) => {
    table.text("file");
  });

  await Promise.all([
    knex
      .table("songs")
      .update({
        file: "good_life.wav",
      })
      .where("id", 1),
    knex
      .table("songs")
      .update({
        file: "rune_delta.wav",
      })
      .where("id", 2),
    knex
      .table("songs")
      .update({
        file: "leave_me.wav",
      })
      .where("id", 3),
  ]);

  return knex.schema.table("songs", (table) => {
    table.unique(["file"]);
    table.dropNullable("file");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("songs", (table) => {
    table.dropColumn("file");
  });
}
