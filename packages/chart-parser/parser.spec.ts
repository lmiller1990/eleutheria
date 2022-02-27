import fs from "fs";
import { describe, expect, it } from "vitest";
import path from "path";
import { parseChart } from "./parser";
import { deriveLasers } from ".";

function loadData(id: string) {
  const exampleDir = path.resolve(__dirname, "test", "resources", id);
  const metadata = fs.readFileSync(path.join(exampleDir, "data.json"), "utf-8");
  const noteChart = fs.readFileSync(path.join(exampleDir, `${id}.chart`), "utf-8");
  const laserChart = fs.readFileSync(path.join(exampleDir, `${id}-left-laser.chart`), "utf-8");

  return {
    metadata: JSON.parse(metadata),
    noteChart,
    laserChart
  };
}

describe("parseChart", () => {
  it("works", () => {
    const data = loadData("example-song");
    const actual = parseChart(data.metadata, data.noteChart);
    expect(actual).toMatchSnapshot();
  });
});

describe("deriveLasers", () => {
  it("works", () => {
    const data = loadData("example-song");
    const parsed = parseChart(data.metadata, data.laserChart);
    const actual = deriveLasers(parsed.notes)
    expect(actual).toMatchSnapshot();
  });
});
