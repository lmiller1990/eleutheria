import express, { Request, Response } from "express";
import cors from "cors";
import path from "node:path";
import http from "node:http";
import bodyParser from "body-parser";
import chokidar from "chokidar";
import type {
  ParamData,
  UserScripts,
  BaseSong,
  LoadSongData,
} from "@packages/types";
import { WebSocketServer } from "ws";
import fs from "fs-extra";
import {
  ChartMetadata,
  parseChart,
  parseHoldsChart,
} from "@packages/chart-parser";
import {
  compileSkins,
  compileUserStyle,
  readUserJavaScript,
} from "./scripts/generateNotes";
import { graphqlHTTP } from "express-graphql";
import { graphqlSchema } from "./src/graphql/schema";
import { knex } from "./src/knex";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./src/middleware/session";
import pg from "pg";
import { debug } from "./util/debug";
import { contextMiddleware } from "./src/middleware/context";

const log = debug("game-data:index");

const pgClient = new pg.Client({
  user: "lachlan",
  database: "rhythm",
});

export const COOKIE = "rhythm-cookie";

console.log("Starting game server...");

export declare namespace DB {
  interface User {
    id: string;
    email: string;
    password: string;
  }
}

const PORT = 5566;

const app = express();

const SECRET = "keyboard cat";

app.use(cors());
app.use(cookieParser(SECRET));
app.use(bodyParser.json());

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

interface WebSocketEditorStartMessage {
  type: "editor:start";
  data: ParamData;
}

type WebSocketPayload = WebSocketEditorStartMessage;

let watchers = new Map<string, chokidar.FSWatcher>();

wss.on("connection", (ws) => {
  ws.on("message", (buffer) => {
    const msg = JSON.parse(buffer.toString()) as WebSocketPayload;

    if (msg.type === "editor:start") {
      if (!watchers.has(msg.data.id)) {
        const chartPath = path.join(
          songsDir,
          msg.data.id,
          msg.data.difficulty,
          `${msg.data.id}.chart`
        );
        const watcher = chokidar.watch(chartPath);

        watchers.set(`${msg.data.id}-${msg.data.difficulty}`, watcher);

        watcher.on("change", async () => {
          try {
            const newData = await loadSong(msg.data.id);
            ws.send(
              JSON.stringify({ type: "editor:chart:updated", data: newData })
            );
          } catch (e) {
            //
          }
        });
      }
    }
  });
});

const songMetadata = fs.readJsonSync("./songMetadata.json");

const songsDir = path.join(__dirname, "songs");

async function loadSong(id: string): Promise<LoadSongData> {
  const chartPath = path.join(songsDir, id);

  const _metadata = await fs.readFile(
    path.join(chartPath, "data.json"),
    "utf-8"
  );

  const metadata = JSON.parse(_metadata) as ChartMetadata;

  const charts = await Promise.all(
    metadata.charts.map(async (chart) => {
      return {
        ...chart,
        tapNotes: await fs.readFile(
          path.join(chartPath, chart.difficulty, `${id}.chart`),
          "utf-8"
        ),
        holdNotes: await fs.readFile(
          path.join(chartPath, chart.difficulty, `${id}.holds.chart`),
          "utf-8"
        ),
      };
    })
  );

  const data: LoadSongData = {
    charts: charts.map((chartData) => {
      return {
        ...chartData,
        parsedTapNoteChart: parseChart(metadata, chartData.tapNotes),
        parsedHoldNoteChart: parseHoldsChart(metadata, chartData.holdNotes),
      };
    }),
    metadata: {
      ...metadata,
      duration: songMetadata[id] ?? "??",
    },
  };

  return data;
}

app.get("/", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.send(await req.ctx.sources.html.prodModeIndexHtml());
    return;
  }

  res.send(req.ctx.sources.html.devModeIndexHtml);
});

app.get("/assets/:asset", (req, res) => {
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

app.get("/songs/:id", async (req, res) => {
  const data = await loadSong(req.params.id);

  res.json(data);
});

app.get("/note-skins", (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    const skins = compileSkins(path.join(__dirname, "notes"), "css");
    res.json(skins);
  }

  const notesDir = path.join(__dirname, "notes");
  const skins = compileSkins(notesDir, "scss");
  res.json(skins);
});

app.post<{}, {}, { name: string; password: string }>(
  "/login",
  async (req, res) => {
    const user = await knex<DB.User>("users")
      .where({ email: req.body.name, password: req.body.password })
      .first();

    if (user) {
      await knex("sessions")
        .where({ id: req.session.id })
        .update({ user_id: user.id });
    }

    res.json(user);
  }
);

app.use(
  "/graphql",
  graphqlHTTP((_req, res) => {
    const req = _req as unknown as Express.Request;
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

app.get("/songs", async (_req, res) => {
  const assets = (await fs.readdir(songsDir)).filter((x) => !x.startsWith("."));

  const songs: BaseSong[] = await Promise.all(
    assets.map(async (p): Promise<BaseSong> => {
      const data = await loadSong(p);

      return {
        ...data.metadata,
        id: p,
        charts: data.charts,
      };
    })
  );

  res.json(songs);
});
