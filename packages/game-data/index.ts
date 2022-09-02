import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import chokidar from "chokidar";
import type { ParamData } from "@packages/types";
import { WebSocketServer } from "ws";
import fs from "fs-extra";
import {
  ChartMetadata,
  parseChart,
  ParsedTapNoteChart,
  ParsedHoldNoteChart,
  parseHoldsChart,
} from "@packages/chart-parser";
import type { BaseSong } from "@packages/types";
import { compileSkins } from "./scripts/generateNotes";

const PORT = 8000;

const app = express();

app.use(cors());

const server = http.createServer(app);

server.listen(PORT, () => {
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

interface WebSocketChartUpdatedMessage {
  type: "editor:chart:updated";
  data: LoadSongData;
}

export type WebSocketEmitData = WebSocketChartUpdatedMessage;

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

export interface LoadSongData {
  charts: Array<{
    difficulty: string;
    level: number;
    parsedTapNoteChart: ParsedTapNoteChart;
    parsedHoldNoteChart: ParsedHoldNoteChart;
  }>;
  metadata: ChartMetadata;
}

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

app.get("/songs/:id", async (req, res) => {
  const data = await loadSong(req.params.id);

  res.json(data);
});

app.get("/note-skins", (_req, res) => {
  const skins = compileSkins();
  res.json(skins);
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
