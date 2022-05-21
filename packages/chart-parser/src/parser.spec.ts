import fs from "fs";
import { describe, expect, it } from "vitest";
import path from "path";
import { parseChart } from "./parser";
import { parseHoldsChart } from ".";

function loadData(id: string, type: "notes" | "holds") {
  const exampleDir = path.resolve(__dirname, "..", "test", "resources", id);
  const metadata = fs.readFileSync(path.join(exampleDir, "data.json"), "utf-8");
  const file = type === "notes" ? `${id}.chart` : `${id}-holds.chart`;
  const noteChart = fs.readFileSync(path.join(exampleDir, file), "utf-8");

  return {
    metadata: JSON.parse(metadata),
    noteChart,
  };
}

describe("parseChart", () => {
  it("works", () => {
    const data = loadData("example-song", "notes");
    const actual = parseChart(data.metadata, data.noteChart);
    expect(actual).toMatchSnapshot();
  });
});

describe("parseHoldsChart", () => {
  it("works", () => {
    const data = loadData("example-song", "holds");
    const actual = parseHoldsChart(data.metadata, data.noteChart);
    expect(actual).toMatchSnapshot();
  });

  it("supports multiple holds holds-simultaneously", () => {
    const data = loadData("holds-simultaneously", "holds");
    const actual = parseHoldsChart(data.metadata, data.noteChart);
    expect(actual).toMatchSnapshot();
  });
});
