import path from "path";
import fs from "fs-extra";
import sass from "sass";

const userDir = path.join(__dirname, "..", "user");

export async function readUserJavaScript(): Promise<string> {
  const p = path.join(userDir, "index.scss");

  if (!(await fs.pathExists(p))) {
    return "/* No user JavaScript */";
  }

  return fs.readFile(p, "utf8");
}

export async function compileUserStyle(): Promise<string> {
  const p = path.join(userDir, "index.scss");

  if (!(await fs.pathExists(p))) {
    return "/* No user stylesheet */";
  }

  return sass.compile(p).css;
}
