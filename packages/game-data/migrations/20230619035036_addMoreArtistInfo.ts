import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex("creator_social")
    .where({
      id: 6,
      social_name: "twitter",
    })
    .update({
      link: "https://twitter.com/Zaiasims",
    });

  await knex("creator").insert({ id: 8, name: "イチノセ奏" });
  await knex("creator").insert({ id: 9, name: "mot(モット)" });

  await Promise.all([
    knex("creator_social").insert({
      id: 8,
      social_name: "skeb",
      link: "https://skeb.jp/@kanade_cocotte",
    }),

    knex("creator_social").insert({
      id: 8,
      social_name: "twitter",
      link: "https://twitter.com/kanade_cocotte",
    }),

    knex("creator_social").insert({
      id: 9,
      social_name: "skeb",
      link: "https://skeb.jp/@MotMottto",
    }),

    knex("creator_social").insert({
      id: 9,
      social_name: "twitter",
      link: "https://twitter.com/MotMottto",
    }),

    // Rune Delta - Kanade Ichinose
    knex("songs")
      .update({
        banner_creator_id: 8,
      })
      .where({
        id: 2,
      }),

    // Leave me - MotMotto
    knex("songs")
      .update({
        banner_creator_id: 9,
      })
      .where({
        id: 3,
      }),
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex("creator_social")
    .where({
      id: 6,
      social_name: "twitter",
    })
    .update({
      link: "????",
    });

  await knex("creator_social").where({ id: 8 }).orWhere({ id: 9 }).delete();
  await knex("creator").where({ id: 8 }).orWhere({ id: 9 }).delete();
}
