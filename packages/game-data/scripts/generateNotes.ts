import path from "path";
import fs from "fs-extra";
import sass from "sass";
import { NoteSkin } from "@packages/types/src";

const notesDir = path.join(__dirname, "..", "notes");

export function compileSkins(): NoteSkin[] {
  const skins = fs.readdirSync(notesDir);

  return skins.map((name) => {
    return {
      css: sass.compile(path.join(notesDir, name, "index.scss"), {}).css,
      name,
    };
  });
}
