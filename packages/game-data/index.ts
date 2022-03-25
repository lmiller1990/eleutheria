import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import { BaseNote, ChartMetadata, parseChart, ParsedChart, ParsedHoldChart, parseHoldsChart } from "@packages/chart-parser";
import type { BaseSong } from "@packages/types";

const app = express();
app.use(cors());

const songsDir = path.join(__dirname, "songs");

export interface SongData {
  noteChart: ParsedChart<BaseNote[]>
  holdChart: ParsedHoldChart
  metadata: ChartMetadata
}

app.get("/songs/:id", (req, res) => {
  const chartPath = path.join(songsDir, req.params.id);

  const noteChart = fs.readFileSync(
    path.join(chartPath, `${req.params.id}.chart`),
    "utf-8"
  );

  const holdsChart = fs.readFileSync(
    path.join(chartPath, `${req.params.id}-holds.chart`),
    "utf-8"
  );

  const metadata = JSON.parse(
    fs.readFileSync(path.join(chartPath, "data.json"), "utf-8")
  );

  const response: SongData = {
    noteChart: parseChart(metadata, noteChart),
    holdChart: parseHoldsChart(metadata, holdsChart),
    metadata
  }

  res.json(response)
});

app.get("/songs", async (req, res) => {
  const assets = await fs.readdir(songsDir);

  const songs: BaseSong[] = await Promise.all(
    assets.map(async (p) => {
      const t = path.join(songsDir, p, "data.json");
      const json = (await fs.readJson(t)) as ChartMetadata;

      return {
        id: p,
        bpm: json.bpm,
        title: json.title,
        charts: [],
      };
    })
  );

  res.json(songs);
});

app.listen(8000, () => console.log("Started data server on port 8000"));
