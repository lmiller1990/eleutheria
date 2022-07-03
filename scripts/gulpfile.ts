import gulp from "gulp";
import dedent from "dedent";
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

  function build() {
    spawn("yarn", ["build"], {
      stdio: "inherit",
      cwd: "packages/breeze-css",
    }).on("exit", () => {
      console.log("Generated latest breeze.css assets!");
    });
  }

  watcher.on("change", () => {
    build();
  });

  build();
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
    procs.forEach((p) => p.kill());
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

async function createChart() {
  const results = await inquirer.prompt<{
    songName: string;
    difficultyName: string;
  }>([
    {
      name: "songName",
      type: "input",
      message: "What is the song name?",
      validate: (val: string) => /[A-z\-]+/.test(val),
    },
    {
      name: "difficultyName",
      type: "input",
      message: "What is the difficulty name?",
      validate: (val: string) => /[A-z\-]+/.test(val),
    },
  ]);

  const newDir = path.join(
    __dirname,
    "..",
    "packages",
    "game-data",
    "songs",
    results.songName,
    results.difficultyName
  );
  await fs.mkdir(newDir);

  await Promise.all([
    fs.writeFile(path.join(newDir, `${results.songName}.chart`), ""),
    fs.writeFile(path.join(newDir, `${results.songName}.holds.chart`), ""),
  ]);
}

async function createComponent() {
  const results = await inquirer.prompt<{
    name: string;
    test: string;
  }>([
    {
      name: "name",
      type: "input",
      message: "What is the component name?",
      validate: (val: string) => /[A-z\-]+/.test(val),
    },
    {
      name: "test",
      type: "input",
      message: "Create test file? y/n",
      validate: (val: string) => /[A-z\-]+/.test(val),
    },
  ]);

  const newDir = path.join(
    __dirname,
    "..",
    "packages",
    "frontend",
    "src",
    "components",
    results.name
  );
  await fs.mkdir(newDir);

  await Promise.all([
    fs.writeFile(path.join(newDir, `${results.name}.vue`), 
      dedent`
        <script lang="ts" setup>
        import type { ${results.name}Props } from "./types";

        const props = defineProps<${results.name}Props>();
        </script>

        <template>
        </template>

        <style>
        @import "../../index.css";
        @import "../../../../breeze-css/dist/breeze.css";
        </style>

        <style scoped lang="scss">
        @import "../../shared.scss";
        </style>
      `
    ),

    fs.writeFile(
      path.join(newDir, `index.ts`),
      dedent`
        import ${results.name} from "./${results.name}.vue";

        export default ${results.name};
      `
    ),
    fs.writeFile(
      path.join(newDir, `types.ts`),
      dedent`
        export interface ${results.name}Props {
        }
      `
    ),
    results.test.toLowerCase().startsWith("y")
      ? fs.writeFile(
          path.join(newDir, `${results.name}.cy.ts`),
          dedent`
        import { mount as _mount } from "cypress/vue";
        import ${results.name} from "./${results.name}.vue";
        import { ${results.name}Props } from "./types";

        function render(_props?: Partial<${results.name}Props>) {
          const props = {
            ..._props,
          };

          return _mount(${results.name}, {
            props,
          });
        }

        describe("${results.name}", () => {
          it("renders", () => {
            render({});
          });
        });
      `
        )
      : Promise.resolve(),
  ]);
}

gulp.task("createPkg", createPkg);
gulp.task("createChart", createChart);
gulp.task("createComponent", createComponent);

gulp.task(
  "dev",
  gulp.series(serverDev, assetsServer, gameDataServer, breezeCss)
);
