import execa from "execa";
import path from "path";

const packages = path.join(__dirname, "..", "packages");

async function build(pkg: string) {
  console.log(`Building ${pkg}`);
  return execa("yarn", ["build"], {
    cwd: path.join(packages, pkg),
    shell: true,
    stderr: "pipe",
  });
}
async function main() {
  // 1. we build front-end first, because game-data needs the manifest
  // that is generated
  try {
    await build("types");
    await build("chart-parser");
    await build("audio-utils");
    await build("engine")
    await build("frontend");

    // 2. game-data (the backend)
    await build("game-data");
  } catch (e) {
    console.log("Error building", e);
  }
}

main();
