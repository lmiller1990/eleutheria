import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex("covers").insert({
    name: "animals",
    thumbnail_color: "#f8f3d6",
    css: `#lane-cover { 
  background: #f8f3d6; 
  display: flex; 
  align-items: center; 
  justify-content: center;
} 

#cover-image-animals { 
  max-height: 100%; 
}`,
    code: `const el = document.createElement("img"); el.id = "cover-image-animals"; el.src = "https://static.vecteezy.com/system/resources/previews/024/678/073/non_2x/cute-animal-portraits-great-for-designing-baby-clothes-posters-avatar-icon-cards-pattern-for-fabrics-wrapping-paper-wallpaper-postcards-illustration-in-flat-simple-geometric-style-vector.jpg"; document.querySelector("#lane-cover").appendChild(el);`,
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex("covers").delete().whereIn("name", ["animals"]);
}
