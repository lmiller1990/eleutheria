import fs from "fs";
import { describe, it } from "vitest";
import path from "path";
import { ChartMetadata, parseChart } from "./parser";

function loadData() {
  const exampleDir = path.resolve(
    __dirname,
    "test",
    "resources",
    "example-song"
  );
  const metadata = fs.readFileSync(path.join(exampleDir, "data.json"), "utf-8");
  const chart = fs.readFileSync(
    path.join(exampleDir, "example-song.chart"),
    "utf-8"
  );

  return {
    metadata: JSON.parse(metadata),
    chart,
  };
}

describe("parseChart", () => {
  it("works", () => {
    const data = loadData();
    const actual = parseChart(data.metadata, data.chart);

    console.log(actual)

    for (let i = 0; i < actual.notes.length; ++i) {
      let c = actual.notes[i]
      let n = actual.notes[i + 1]

      if (c && n) {
        console.log(n.ms - c.ms)
      }
    }
  });
});
