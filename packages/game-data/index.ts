import express, { Request } from "express";
import fs from "fs-extra";
import cors from "cors";
import path from "node:path";
import http from "node:http";
import bodyParser from "body-parser";
import chokidar from "chokidar";
import type { UserScripts } from "@packages/shared";
import { WebSocketServer } from "ws";
import { compileUserStyle, readUserJavaScript } from "./scripts/generateNotes";
import { graphqlHTTP } from "express-graphql";
import { graphqlSchema } from "./src/graphql/schema";
import { knexTable } from "./src/knex";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./src/middleware/session";
import pg from "pg";
import { debug } from "./util/debug";
import { contextMiddleware } from "./src/middleware/context";
import type { Users } from "./ dbschema";
import { EditorActions } from "./src/actions/editor";
import { Context } from "./src/graphql/context";

const log = debug("game-data:index");

const pgClient = new pg.Client({
  user: process.env.POSTGRES_USER ?? "lachlan",
  database: process.env.POSTGRES_DB ?? "rhythm",
});

export const COOKIE = "rhythm-cookie";

console.log("Starting game server...");

const PORT = 5566;

const app = express();

const SECRET = "keyboard cat";

app.use(cors());
app.use(cookieParser(SECRET));
app.use(bodyParser.json({ limit: "1mb" }));

app.use(sessionMiddleware);
app.use(contextMiddleware);

const server = http.createServer(app);

app.get("/health-check", (_req, res) => {
  res.json({ msg: "ok" });
});

server.listen(PORT, async () => {
  await pgClient.connect();
  console.log(`Started data server on port ${PORT}`);
});

const wss = new WebSocketServer({
  server,
});

// @ts-ignore - figure out how we want to handle editing eventually
// Just need this for the EditorActions
const ctxSingleton = new Context(null, null);

const watcher = chokidar.watch(EditorActions.editingPath);

const marketing =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "..", "..", "marketing", "dist")
    : path.join(__dirname, "..", "marketing", "dist");

wss.on("connection", (ws) => {
  watcher.on("change", async () => {
    try {
      console.log("Writing chart to db...");
      await ctxSingleton.actions.editor.writeChartToDb();
      ws.send(JSON.stringify({ type: "editor:chart:updated" }));
    } catch (e) {
      //
    }
  });
});

app.get("/app", async (req, res) => {
  const ssrData = await req.ctx.actions.graphql.selectSongScreenQuery();

  if (process.env.NODE_ENV === "production") {
    res.send(await req.ctx.sources.html.prodModeIndexHtml(ssrData));
    return;
  }

  res.send(req.ctx.sources.html.devModeIndexHtml(ssrData));
});

app.get("/", async (_req, res) => {
  res.sendFile(path.join(marketing, "index.html"));
});

// marketing page styling
app.get("/output.css", async (_req, res) => {
  res.sendFile(path.join(marketing, "output.css"));
});

app.get(
  ["", "/app", "/assets", "/app/assets"].map((x) => `${x}/KleeOne-Regular.ttf`),
  async (_req, res) => {
    res.sendFile(path.join(marketing, "KleeOne-Regular.ttf"));
  }
);

app.get("/app/", (_req, res) => {
  res.redirect("/app");
});

app.get(
  ["game", "summary"].map((x) => `/app/${x}`),
  async (_req, res) => {
    res.redirect("/app");
  }
);

app.get(["/app/assets/:asset", "/assets/:asset"], (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "dist",
      "assets",
      req.params.asset
    )
  );
});

app.get("/static/:asset", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    const p = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "static",
      req.params.asset
    );
    log(`serving static asset ${req.params.asset} from path ${p}`);
    res.sendFile(p);
    return;
  }
  const p = path.join(__dirname, "..", "frontend", "static", req.params.asset);
  log(`serving static asset ${req.params.asset} from path ${p}`);
  res.sendFile(p);
});

app.post<{}, {}, { name: string; password: string }>(
  "/login",
  async (req, res) => {
    const user = await knexTable<Users>("users")
      .where({ email: req.body.name, password: req.body.password })
      .first();

    if (user) {
      await knexTable("sessions")
        .where({ id: req.session.id })
        .update({ user_id: user.id });
    }

    res.json(user);
  }
);

app.use(
  "/graphql",
  graphqlHTTP((_req, _res) => {
    const req = _req as unknown as Express.Request & Request;
    return {
      schema: graphqlSchema,
      graphiql: true,
      context: req.ctx,
    };
  })
);

app.get("/user", async (_req, res) => {
  const [css, js] = await Promise.all([
    await compileUserStyle(),
    await readUserJavaScript(),
  ]);

  const data: UserScripts = {
    js,
    css,
  };

  res.json(data);
});

// blog posts
const blogPosts = fs.readJsonSync(
  path.join(marketing, "metadata.json")
) as Array<{ filename: string }>;

blogPosts.forEach((post) => {
  app.get(`/${post.filename}`, (_req, res) => {
    res.sendFile(path.join(marketing, `${post.filename}.html`));
  });
});

// blog post assets
const blogPostsAssets = fs.readJsonSync(
  path.join(marketing, "assets.json")
) as string[];

blogPostsAssets.forEach((asset) => {
  app.get(`/${asset}`, (_req, res) => {
    res.sendFile(path.join(marketing, asset));
  });
});
