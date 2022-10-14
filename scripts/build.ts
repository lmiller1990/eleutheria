import execa from "execa";
import path from "path";

const packages = path.join(__dirname, "..", "packages");

async function build(pkg: string, command = 'build') {
  console.log(`Running ${command} in ${pkg}...`);
  return execa("yarn", [command], {
    cwd: path.join(packages, pkg),
    shell: true,
    stderr: "pipe",
  });
}
async function main() {
  // 1. we build front-end first, because game-data needs the manifest
  // that is generated
  try {
    await build("shared");
    await build("chart-parser");
    await build("audio-utils");
    await build("engine")
    await build("game-data", "build-schema");
    await build("frontend");
    await build("marketing")

    // 2. game-data (the backend)
    await build("game-data");
  } catch (e) {
    console.log("Error building", e);
  }
}

main();
