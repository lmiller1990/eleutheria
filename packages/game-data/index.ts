import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import {
  ChartMetadata,
  parseChart,
  ParsedTapNoteChart,
  ParsedHoldNoteChart,
  parseHoldsChart,
} from "@packages/chart-parser";
import type { BaseSong } from "@packages/types/src";

const app = express();
app.use(cors());

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

app.listen(8000, () => console.log("Started data server on port 8000"));
