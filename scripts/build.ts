import { spawn } from "node:child_process";

export async function spawnProcess(
  name: string,
  pkg: string,
  command: string[] = ["build"]
) {
  const cwd = `packages/${pkg}`;
  console.log(`Running ${command.join(" ")} in ${cwd}...`);

  return new Promise<void>((resolve, reject) => {
    spawn("yarn", command, {
      stdio: "inherit",
      cwd,
    })
      .on("exit", () => {
        console.log(`✅ ${name}`);
        resolve();
      })
      .on("error", (err) => {
        console.log("error", err);
        reject(err);
      });
  });
}

async function main() {
  try {
    // Nexus
    await spawnProcess("Nexus", "game-data", ["build-schema"]);
    // Frontend GraphQL
    await spawnProcess("GraphQL Codegen", "frontend", ["codegen"]);
    await spawnProcess("Shared", "shared");
    await spawnProcess("Chart Parser", "chart-parser");
    await spawnProcess("Audio Utils", "audio-utils");
    await spawnProcess("Engine", "engine");
    await spawnProcess("Frontend", "frontend");
    await spawnProcess("Marketing Page", "marketing");

    // 2. game-data (the backend)
    await spawnProcess("Backend", "game-data");
  } catch (e) {
    console.log("Error building", e);
  }
}

main();
