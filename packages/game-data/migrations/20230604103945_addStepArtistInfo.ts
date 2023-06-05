import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("charts", (table) => {
    table.integer("creator");
  });

  await Promise.all([
    knex("creator").insert({ id: 5, name: "Lachlan" }),
    knex("creator").insert({ id: 6, name: "Zaia" }),
  ]);

  await Promise.all([
    knex("creator_social").insert({
      id: 5,
      social_name: "twitter",
      link: "https://twitter.com/@Lachlan19900",
    }),
    knex("creator_social").insert({
      id: 5,
      social_name: "github",
      link: "https://github.com/lmiller1990",
    }),
    knex("creator_social").insert({
      id: 6,
      social_name: "twitter",
      link: "????",
    }),
  ]);

  function chart(id: number) {
    return knex("charts").where({ id }).first()!;
  }

  await Promise.all([
    // Abyss breaker
    chart(7).update({ creator: 5 }),
    chart(8).update({ creator: 5 }),
    chart(13).update({ creator: 6 }),

    // Good life
    chart(11).update({ creator: 5 }),
    chart(12).update({ creator: 6 }),
    chart(6).update({ creator: 5 }),

    // leave me
    chart(9).update({ creator: 5 }),
    chart(5).update({ creator: 6 }),
    chart(14).update({ creator: 5 }),

    // rune delta
    chart(10).update({ creator: 5 }),
    chart(3).update({ creator: 5 }),
    chart(15).update({ creator: 6 }),
  ]);

  await knex.schema.alterTable("charts", (table) => {
    table.integer("creator").alter({ alterNullable: true }).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex("creator_social").where({ id: 5 }).orWhere({ id: 6 }).delete();
  await knex("creator").where({ id: 5 }).orWhere({ id: 6 }).delete();
  await knex.schema.alterTable("charts", (table) => {
    table.dropColumn("creator");
  });
}
