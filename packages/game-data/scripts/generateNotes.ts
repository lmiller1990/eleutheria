import path from "path";
import fs from "fs-extra";
import sass from "sass";
import { NoteSkin } from "@packages/types/src";

const notesDir = path.join(__dirname, "..", "notes");
const outDir = path.join(__dirname, "..", "dist", "notes");

export function compileSkins(): NoteSkin[] {
  const skins = fs.readdirSync(notesDir);

  return skins.map((name) => {
    return {
      css: sass.compile(path.join(notesDir, name, "index.scss"), {}).css,
      name,
    };
  });
}

function cleanDist() {
  if (fs.existsSync(outDir)) {
    fs.rmdirSync(outDir);
  }

  fs.mkdirSync(outDir, { recursive: true });
}

export function generateNotes() {
  cleanDist();

  for (const skin of compileSkins()) {
    fs.writeFileSync(path.join(outDir, `${skin.name}.css`), skin.css, "utf-8");
  }
  console.log("Generated note skins");
}
