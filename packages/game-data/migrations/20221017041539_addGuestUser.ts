import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex("users").insert({
    email: "guest@eleutheria",
    username: "guest",
    password: "guest",
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex("users")
    .where({
      email: "guest@eleutheria",
      username: "guest",
      password: "guest",
    })
    .delete();
}
