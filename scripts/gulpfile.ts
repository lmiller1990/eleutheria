import gulp from "gulp";
import { spawn } from "child_process";

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

gulp.task("dev", gulp.series(serverDev, assetsServer));
