import path from "path";
import execa from "execa";

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const pkg = path.join(root, "packages");

async function build() {
  await execa("yarn", ["build"], {
    cwd: path.join(pkg, "frontend"),
  });

  await execa("mv", [
    path.join(pkg, "frontend", "dist"),
    path.join("dist", "app"),
  ]);

  await execa("")
}

build();
