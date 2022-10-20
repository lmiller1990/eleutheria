import execa from "execa";

async function main() {
  try {
    console.log("Creating database...");
    if (!Boolean(process.env.NO_DB)) {
      await execa(
        "createdb",
        [
          "--host",
          "localhost",
          "-U",
          "postgres",
          process.env.POSTGRES_DB ?? "rhythm",
        ],
        {
          cwd: __dirname,
          shell: true,
        }
      );
    }

    console.log("Creating tables...");
    await execa("yarn", ["knex", "migrate:latest"], {
      shell: true,
      cwd: __dirname,
    });
  } catch (e) {
    console.log(e);
  }
}

main();
