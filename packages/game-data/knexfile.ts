module.exports = {
  client: "pg",
  connection: {
    user: process.env.POSTGRES_USER ?? "lachlan",
    database: process.env.POSTGRES_DB ?? "rhythm",
  },
  migrations: {
    extension: "ts",
  },
};
