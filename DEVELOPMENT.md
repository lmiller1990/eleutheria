# Development

Eleutheria runs on a fairly simple stack. You'll need to install

- Node.js 16+
- Yarn
- Postgres

```
# Update apt
apt update

# Add Node.js 16
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Install Node.js 16
apt install -y nodejs

# Install yarn
npm install --global yarn

# Postgres
sudo apt install postgresql postgresql-contrib

# Start postgres
sudo systemctl start postgresql.service
```

## Database

Create a user and database however you like. Then, you'll need to run the migrations.

```sh
# cd into game-data
cd packages/game-data

# run migrations = I put some example env vars, put the correct ones for your setup.
PGPASSWORD=<PASSWORD> POSTGRES_HOST=localhost POSTGRES_USER=eleutheria POSTGRES_DB=eleutheria yarn knex migrate:latest
```

If it worked, you'll see:

```
Requiring external module ts-node/register
Batch 1 run: 7 migrations
Done in 11.88s.
```

## Local Development

Once you set up the database, you can start development by running `yarn dev` at the root and visting `http://localhost:5566`.

## Deployment

Build the app with `yarn build` at the top level.