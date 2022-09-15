import execa from "execa";

async function main() {
  const whoami = (await execa("whoami", { shell: true })).stdout.trim();

  try {
    await execa("yarn", [
      "pg-to-ts",
      "generate",
      "-c",
      `postgresql://${whoami}@localhost/rhythm`,
      "-o dbschema.ts",
    ]);
  } catch (e) {
    console.log(e);
  }
}

main();
