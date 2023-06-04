import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("songs", (table) => {
    table.integer("banner_creator_id");
  });

  await knex("creator").insert({ id: 7, name: "Unknown" }),
    await knex("creator_social").insert({
      id: 7,
      social_name: "twitter",
      link: "https://twitter.com/unknown",
    }),
    await knex("songs").update({ banner_creator_id: 7 }),
    await knex.schema.alterTable("songs", (table) => {
      table
        .integer("banner_creator_id")
        .alter({ alterNullable: true })
        .notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("songs", (table) => {
    table.dropColumn("banner_creator_id");
  });
  await knex("creator").where("id", 7).delete();
  await knex("creator_social").where("id", 7).delete();
}
