import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs-extra";
import { ChartMetadata, parseChart } from "@packages/chart-parser";
import type { BaseSong } from "@packages/types";

const app = express();
app.use(cors());

const songsDir = path.join(__dirname, "songs");

app.get("/songs/:id", (req, res) => {
  const chartPath = path.join(songsDir, req.params.id);

  const chart = fs.readFileSync(
    path.join(chartPath, `${req.params.id}.chart`),
    "utf-8"
  );

  const meta = JSON.parse(
    fs.readFileSync(path.join(chartPath, "data.json"), "utf-8")
  );

  const data = parseChart(meta, chart);

  res.json(data);
});

app.get("/songs", async (req, res) => {
  const assets = await fs.readdir(songsDir);

  const songs: BaseSong[] = await Promise.all(
    assets.map(async (p) => {
      const t = path.join(songsDir, p, "data.json")
      const json = await fs.readJson(t) as ChartMetadata;

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
