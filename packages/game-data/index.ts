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
  parsedTapNoteChart: ParsedTapNoteChart;
  parsedHoldNoteChart: ParsedHoldNoteChart;
  metadata: ChartMetadata;
}

const songsDir = path.join(__dirname, "songs");

async function loadSong(id: string): Promise<LoadSongData> {
  const chartPath = path.join(songsDir, id);

  const [_metadata, tapNotes, holdNotes] = await Promise.all([
    fs.readFile(path.join(chartPath, "data.json"), "utf-8"),
    fs.readFile(path.join(chartPath, `${id}.chart`), "utf-8"),
    fs.readFile(path.join(chartPath, `${id}.holds.chart`), "utf-8"),
  ]);

  const metadata = JSON.parse(_metadata) as ChartMetadata;

  const data: LoadSongData = {
    parsedTapNoteChart: parseChart(metadata, tapNotes),
    parsedHoldNoteChart: parseHoldsChart(metadata, holdNotes),
    metadata,
  };

  return data;
}

app.get("/songs/:id", async (req, res) => {
  const data = await loadSong(req.params.id);

  res.json(data);
});

app.get("/songs", async (req, res) => {
  const assets = (await fs.readdir(songsDir)).filter((x) => !x.startsWith("."));

  const songs: BaseSong[] = await Promise.all(
    assets.map(async (p): Promise<BaseSong> => {
      const { metadata, parsedTapNoteChart, parsedHoldNoteChart } =
        await loadSong(p);

      return {
        ...metadata,
        id: p,
        charts: [
          {
            difficulty: "expert",
            level: 5,
            parsedTapNoteChart,
            parsedHoldNoteChart,
          },
        ],
      };
    })
  );

  res.json(songs);
});

app.listen(8000, () => console.log("Started data server on port 8000"));
