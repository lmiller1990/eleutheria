import express from "express";
import cors from 'cors'
import path from "path";
import fs from "fs";
import { parseChart } from "@packages/chart-parser";

const app = express();
app.use(cors())

app.get("/songs/:id", (req, res) => {
  const chartPath = path.join(__dirname, req.params.id);

  const chart = fs.readFileSync(
    path.join(chartPath, `${req.params.id}.chart`),
    "utf-8"
  );

  const meta = JSON.parse(
    fs.readFileSync(path.join(chartPath, "data.json"), "utf-8")
  );

  const data = parseChart(meta, chart);

  res.json(data)
});

app.listen(8000, () => console.log("Started data server on port 8000"));
