import { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.schema.createTable("creator", (table) => {
    table.increments("id", { primaryKey: true });
    table.text("name").notNullable().unique();
  });

  await knex.schema.createTable("creator_social", (table) => {
    table.integer("id"); // key on creator
    table.text("social_name");
    table.text("link");
  });

  await Promise.all([
    knex("creator").insert({ id: 1, name: "Litmus*" }),
    knex("creator").insert({ id: 2, name: "seatrus" }),
    knex("creator").insert({ id: 3, name: "打打だいず" }),
    knex("creator").insert({ id: 4, name: "RuYA" }),
  ]);

  await Promise.all([
    knex("creator_social").insert({
      id: 1,
      social_name: "twitter",
      link: "https://twitter.com/litmus_music",
    }),
    knex("creator_social").insert({
      id: 1,
      social_name: "youtube",
      link: "https://www.youtube.com/@litmus_star",
    }),
    knex("creator_social").insert({
      id: 2,
      social_name: "twitter",
      link: "https://twitter.com/seatrus",
    }),
    knex("creator_social").insert({
      id: 2,
      social_name: "website",
      link: "https://seatrusfrontier.localinfo.jp/",
    }),
    knex("creator_social").insert({
      id: 3,
      social_name: "twitter",
      link: "https://twitter.com/DICE__game",
    }),
    knex("creator_social").insert({
      id: 3,
      social_name: "website",
      link: "https://dicen9999.wixsite.com/works",
    }),
    knex("creator_social").insert({
      id: 4,
      social_name: "twitter",
      link: "https://twitter.com/RuYAya123",
    }),
    knex("creator_social").insert({
      id: 4,
      social_name: "soundcloud",
      link: "https://soundcloud.com/imruyaya",
    }),
  ]);

  await knex.schema.alterTable("songs", (table) => {
    table.integer("creator");
  });

  function song(title: string) {
    return knex("songs").where({ title }).first()!;
  }

  await Promise.all([
    song("Good Life").update({ creator: 1 }),
    song("Rune Delta").update({ creator: 2 }),
    song("Abyss Breaker").update({ creator: 3 }),
    song("Leave me").update({ creator: 4 }),
  ]);

  await knex.schema.alterTable("songs", (table) => {
    table.integer("creator").alter({ alterNullable: true }).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("songs", (table) => {
    table.dropColumn("creator");
  });
  await knex.schema.dropTable("creator_social");
  await knex.schema.dropTable("creator");
}
