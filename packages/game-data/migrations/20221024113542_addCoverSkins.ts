import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
  return Promise.all([
    knex("covers").insert({
      name: "blackcat",
      thumbnail_color: "#d7eeba",
      css: `#lane-cover { 
  background: #d7eeba; 
  display: flex; 
  align-items: center; 
} 

#cover-image-blackcat { 
  max-height: 100%; 
}`,
      code: `const el = document.createElement("img"); el.id = "cover-image-blackcat"; el.src = "https://wallpaperaccess.com/full/1295637.png"; document.querySelector("#lane-cover").appendChild(el);`,
    }),
    knex("covers").insert({
      name: "beach",
      thumbnail_color: "#ecd995",
      css: `#lane-cover { 
  background: #ecd995; 
  display: flex; 
  align-items: center; 
  justify-content: flex-end; 
}

#cover-image-beach {
  max-height: 100%;
}`,
      code: `const el = document.createElement("img"); el.id = "cover-image-beach"; el.src = "https://wallpapercave.com/wp/SvEhAQT.jpg"; document.querySelector("#lane-cover").appendChild(el);`,
    }),
  ]);
}

export async function down(knex: Knex): Promise<any> {
  return knex("covers").delete().whereIn("name", ["blackcat", "beach"]);
}
