import path from "path";
import execa from "execa";

const root = path.join(__dirname, "..");
const pkg = path.join(root, "packages");

async function build() {
  await execa("yarn", ["lerna", "run", "build"], {
    cwd: root
  });

  await execa("mv", [
    path.join(pkg, "frontend", "dist"),
    path.join("dist", "app"),
  ]);

  await execa("yarn", ["build"], {
    cwd: path.join(pkg, "game-data"),
  });

  await execa("yarn", ["build"], {
    cwd: path.join(pkg, "chart-parser"),
  });

  // await execa("")
}

build();
