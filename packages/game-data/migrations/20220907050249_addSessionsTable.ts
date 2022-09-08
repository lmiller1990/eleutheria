import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sessions", (table) => {
    table.text("id").notNullable().unique();
    table.timestamp("created").notNullable().defaultTo(knex.fn.now());
    table.integer("user_id")
    table.foreign("user_id").references("id").inTable("users")
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sessions");
}
