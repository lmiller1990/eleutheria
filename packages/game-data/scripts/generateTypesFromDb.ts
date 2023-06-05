import execa from "execa";

async function main() {
  const whoami = (await execa("whoami", { shell: true })).stdout.trim();

  execa("yarn", [
    "pg-to-ts",
    "generate",
    "-c",
    `postgresql://${whoami}@localhost/${
      process.env.POSTGRES_DB ?? "eleutheria"
    }`,
    "-o dbschema.ts",
  ])
    .catch(console.error)
    .then((_) => console.log("Done"));
}

main();
