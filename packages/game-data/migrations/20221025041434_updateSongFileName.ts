import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`update songs set file = substring(file from '(.*)\.wav');`);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`update songs set file = concat(file, '.wav');`);
}
