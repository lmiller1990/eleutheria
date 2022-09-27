import execa from "execa";

async function main() {
  console.log(process.env)
  console.log(`Creating database: ${process.env.POSTGRES_DB}`);
  await execa("createdb", [process.env.POSTGRES_DB as string], {
    shell: true,
    cwd: __dirname,
  });

  console.log("Creating tables...");
  await execa("yarn", ["knex", "migrate:latest"], {
    shell: true,
    cwd: __dirname,
  });
}

main();
