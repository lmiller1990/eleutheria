const { spawn } = require("child_process");

function run(cmd) {
  const proc = spawn("yarn", cmd, { shell: true, stdio: "inherit" });
  proc.on("exit", (code) => process.exit(code || 0));
  proc.on("message", console.log);
  proc.on("error", console.error);
}

if (process.env.CI) {
  run(
    `cypress run --component --record --key 91f2d29e-a1eb-4278-ad88-1afccc88881d`.split(
      " "
    )
  );
} else {
  run(`cypress run --component`.split(" "));
}
