import fs from "fs";
import { describe, expect, it } from "vitest";
import path from "path";
import { parseChart } from "./parser";

function loadData(id: string) {
  const exampleDir = path.resolve(__dirname, "test", "resources", id);
  const metadata = fs.readFileSync(path.join(exampleDir, "data.json"), "utf-8");
  const chart = fs.readFileSync(path.join(exampleDir, `${id}.chart`), "utf-8");

  return {
    metadata: JSON.parse(metadata),
    chart,
  };
}

describe("parseChart", () => {
  it("works", () => {
    const data = loadData("example-song");
    const actual = parseChart(data.metadata, data.chart);
    expect(actual).toMatchSnapshot();
  });
});
