import execa from "execa";

async function main() {
  console.log("which psql")
  await execa("which", ["psql"], {
    cwd: __dirname,
    shell: true,
  })

  console.log("which createdb")
  await execa("which", ["createdb"], {
    cwd: __dirname,
    shell: true,
  })

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
