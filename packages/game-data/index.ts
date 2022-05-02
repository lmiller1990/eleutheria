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
import type { BaseSong } from "@packages/types";

const app = express();
app.use(cors());

export interface LoadSongData {
  tapNotes: ParsedTapNoteChart;
  holdNotes: ParsedHoldNoteChart;
  metadata: ChartMetadata;
}

const songsDir = path.join(__dirname, "songs");

app.get("/songs/:id", (req, res) => {
  const chartPath = path.join(songsDir, req.params.id);

  const tapNotes = fs.readFileSync(
    path.join(chartPath, `${req.params.id}.chart`),
    "utf-8"
  );

  const holdNotes = fs.readFileSync(
    path.join(chartPath, `${req.params.id}.holds.chart`),
    "utf-8"
  );

  const metadata = JSON.parse(
    fs.readFileSync(path.join(chartPath, "data.json"), "utf-8")
  );

  const data: LoadSongData = {
    tapNotes: parseChart(metadata, tapNotes),
    holdNotes: parseHoldsChart(metadata, holdNotes),
    metadata,
  };

  res.json(data);
});

app.get("/songs", async (req, res) => {
  const assets = (await fs.readdir(songsDir)).filter((x) => !x.startsWith("."));

  const songs: BaseSong[] = await Promise.all(
    assets.map(async (p) => {
      const t = path.join(songsDir, p, "data.json");
      const json = (await fs.readJson(t)) as ChartMetadata;

      return {
        ...json,
        id: p,
        charts: [],
      };
    })
  );

  res.json(songs);
});

app.listen(8000, () => console.log("Started data server on port 8000"));
