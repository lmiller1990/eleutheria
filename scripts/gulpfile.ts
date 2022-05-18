import gulp from "gulp";
import fs from "fs-extra";
import chokidar from "chokidar";
import path from "path";
import inquirer from "inquirer";
import { ChildProcess, spawn } from "child_process";

async function serverDev() {
  spawn("yarn", ["dev"], {
    stdio: "inherit",
    cwd: "packages/frontend",
  });
}

async function assetsServer() {
  spawn("yarn", ["server"], {
    stdio: "inherit",
    cwd: "packages/static",
  });
}

async function breezeCss() {
  const watcher = chokidar.watch(
    path.join(__dirname, "..", "packages", "breeze-css", "**/*.ts")
  );

  function generate() {
    spawn("yarn", ["generate"], {
      stdio: "inherit",
      cwd: "packages/breeze-css",
    }).on("exit", () => {
      console.log("Generated latest breeze.css assets!");
    });
  }

  watcher.on("change", () => {
    generate();
  });

  generate();
}

async function gameDataServer() {
  const start = () => {
    return [
      spawn("yarn", ["start"], {
        stdio: "inherit",
        cwd: "packages/game-data",
      }),
      spawn("yarn", ["build-metadata"], {
        stdio: "inherit",
        cwd: "packages/game-data",
      }),
    ];
  };

  const watcherAll = chokidar.watch([
    path.join(__dirname, "..", "packages", "game-data", "**/*.ts"),
    path.join(__dirname, "..", "packages", "chart-parser", "**/*.ts"),
  ]);

  let procs: ChildProcess[] = [];

  watcherAll.on("change", () => {
    procs.forEach(p => p.kill())
    console.log("Restarting game data server...");
    procs = start();
  });

  procs = start();
}

async function createPkg() {
  const results = await inquirer.prompt<{
    packageName: string;
  }>([
    {
      name: "packageName",
      type: "input",
      message: "What is the package name?",
      validate: (val: string) => /[A-z\-]+/.test(val),
    },
  ]);

  const newDir = path.join(__dirname, "..", "packages", results.packageName);
  await fs.mkdir(newDir);

  await Promise.all([
    fs.writeFile(
      path.join(newDir, "package.json"),
      JSON.stringify(
        {
          name: `@packages/${results.packageName}`,
          version: "0.0.0-development",
          main: "index.ts",
          scripts: {
            test: "echo 'ok'",
          },
          dependencies: {},
          devDependencies: {
            typescript: "4.5.4",
          },
        },
        null,
        2
      )
    ),
    fs.writeFile(path.join(newDir, "index.ts"), ""),
    fs.writeFile(
      path.join(newDir, "tsconfig.json"),
      JSON.stringify(
        {
          extends: "../../tsconfig.json",
          include: ["**/*.ts"],
          compilerOptions: {
            skipLibCheck: true,
          },
        },
        null,
        2
      )
    ),
  ]);
}

gulp.task("createPkg", createPkg);

gulp.task(
  "dev",
  gulp.series(serverDev, assetsServer, gameDataServer, breezeCss)
);
