const { spawn } = require("child_process");

function run(cmd) {
  const proc = spawn("yarn", cmd, { shell: true, stdio: "inherit" });
  proc.on("exit", (code) => process.exit(code || 0));
  proc.on("message", console.log)
  proc.on("error", console.error);
}

if (process.env.CI) {
  run(
    `cypress run --component --record --key 9db0689e-e974-48be-9d9c-5560f615e4be`.split(
      " "
    )
  );
} else {
  run(`cypress run --component`.split(" "));
}
