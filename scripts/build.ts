import path from "path";
import execa from "execa";

const pkg = path.join(__dirname, "..", 'packages');

async function build () {
  await execa("yarn", ["build"], {
    cwd: path.join(pkg, "frontend"),
  });
}

build()