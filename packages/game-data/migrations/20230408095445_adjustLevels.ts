import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await Promise.all([
    knex("charts").update({ level: 5 }).where({ id: 12 }), // Good life - Zaia
    knex("charts").update({ level: 6 }).where({ id: 6 }), // Good life - me
    knex("charts").update({ level: 7 }).where({ id: 13 }), // Abyss Breaker - Zaia
    knex("charts").update({ level: 2 }).where({ id: 9 }), // Leave me - easiest chart
    knex("charts").update({ level: 2 }).where({ id: 10 }), // Rune Delta - easiest chart
    knex("charts").update({ level: 8 }).where({ id: 15 }), // Rune Delta - hardest chart
  ]);
}

export async function down(knex: Knex): Promise<void> {
  // eh don't really care about reverting this
}
