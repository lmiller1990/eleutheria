import fs from "fs";
import path from "path";
import { style } from "./generator";

if (!fs.existsSync(path.join(__dirname, "dist"))) {
  fs.mkdirSync(path.join(__dirname, "dist"));
}

fs.writeFileSync(path.join(__dirname, "dist", "breeze.css"), style);
