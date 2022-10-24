import { Knex } from "knex";

const defaultSkin = `.note {
  height: var(--note-height);
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 2rem;
  border: 1px solid #a8bdc7;
  background: #a8bdc7;
}

.note-1, .note-4 {
  background: #0a6ed6 !important;
}`;

const indigoSkin = `.note {
  border: 1px solid white;
  transform: rotateY(180deg);
  background-image: radial-gradient(95.74% 95.74% at 95.71% 2.13%, #ffffff 0%, #a115b8 100%);
  height: var(--note-height);
  box-sizing: border-box;
}

.note-1, .note-4 {
  border: 1px solid white;
  transform: rotateY(180deg);
  background-image: radial-gradient(95.74% 95.74% at 95.71% 2.13%, rgb(255, 255, 255) 0%, rgb(84, 169, 65) 100%);
  height: var(--note-height);
  box-sizing: border-box;
}`;

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("note_skins", (table) => {
    table.increments("id").notNullable();
    table.text("name").notNullable();
    table.text("css").notNullable();
  });

  return Promise.all([
    knex("note_skins").insert({
      name: "default",
      css: defaultSkin,
    }),
    knex("note_skins").insert({
      name: "indigo",
      css: indigoSkin,
    }),
  ]);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("note_skins");
}
