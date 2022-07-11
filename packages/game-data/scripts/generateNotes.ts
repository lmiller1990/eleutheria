import path from "path";
import fs from "fs-extra";
import sass from "sass";

export async function generateNotes() {
  const notesDir = path.join(__dirname, "..", "notes");
  const outDir = path.join(__dirname, "..", "dist", "notes");

  if (fs.existsSync(outDir)) {
    fs.rmdirSync(outDir)
  }

  fs.mkdirSync(outDir, { recursive: true });

  const skins = await fs.readdir(notesDir);

  for (const skin of skins) {
    const result = sass.compile(path.join(notesDir, skin, "index.scss"));
    fs.writeFileSync(path.join(outDir, `${skin}.css`), result.css, "utf-8");
  }

  console.log('Generated note skins')
}
