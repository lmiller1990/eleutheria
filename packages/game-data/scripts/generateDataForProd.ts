import fs from "fs-extra";
import path from "path";
import { generate } from "./generateMetadata";
import { compileSkins } from "./generateNotes";

async function main() {
  const [_, skins] = await Promise.all([
    generate(),
    compileSkins(path.join(__dirname, "../notes"), "scss"),
  ]);

  for (const skin of skins) {
    await fs.mkdir(path.join(__dirname, `../dist/notes/${skin.name}`), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(__dirname, `../dist/notes/${skin.name}/index.css`),
      skin.css,
      "utf8"
    );
  }
}

main();
