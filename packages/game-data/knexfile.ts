module.exports = {
  client: "pg",
  connection: {
    user: process.env.POSTGRES_USER ?? "lachlan",
    database: process.env.POSTGRES_DB ?? "eleutheria",
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: 5432,
  },
  migrations: {
    extension: "ts",
  },
};
