import gulp from "gulp";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { spawn } from "child_process";

async function serverDev() {
  spawn("yarn", ["dev"], {
    stdio: "inherit",
    cwd: "packages/frontend",
  });
}

async function svgDevServer() {
  spawn("yarn", ["dev"], {
    stdio: "inherit",
    cwd: "packages/svg",
  });
}

async function assetsServer() {
  spawn("yarn", ["server"], {
    stdio: "inherit",
    cwd: "packages/static",
  });
}

async function gameDataServer() {
  spawn("yarn", ["start"], {
    stdio: "inherit",
    cwd: "packages/game-data",
  });
}

async function createPkg() {
  console.log(process.env.ar);
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
  ]);
}

gulp.task("createPkg", createPkg);

gulp.task("dev", gulp.series(serverDev, svgDevServer, assetsServer, gameDataServer));
