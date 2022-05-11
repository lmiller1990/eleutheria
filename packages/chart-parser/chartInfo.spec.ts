import { describe, expect, it } from "vitest";
import type { ChartMetadata } from ".";
import { chartInfo } from "./chartInfo";
import { parseChart, parseHoldsChart } from "./parser";

const chart = (exp: TemplateStringsArray): string => {
  const lines = exp[0].split("\n").filter((x) => x.trim().length > 0);
  return lines.map((x) => x.trim()).join("\n");
};

const holdNotesRaw = chart`
  000000
  010000
  000000
  020000
  ,
  000001
  000000
  000002
  000000
`;

const tapNotesRaw = chart`
  000000
  N00000
  NN0000
  NNN000
  ,
  000000
  000000
  000000
  NNNNNN
`;

const metadata: ChartMetadata = {
  offset: 0,
  title: "",
  banner: "",
  bpm: 150,
};

describe("chartInfo", () => {
  it("works", () => {
    const info = chartInfo(
      parseChart(metadata, tapNotesRaw),
      parseHoldsChart(metadata, holdNotesRaw)
    );

    expect(info.totalNotes).toEqual(14);
    expect(info.holdNotes).toEqual(2);
    expect(info.chords.twoNoteCount).toEqual(2);
    expect(info.chords.threeNoteCount).toEqual(1);
    expect(info.chords.fourNoteCount).toEqual(0);
    expect(info.chords.fiveNoteCount).toEqual(0);
    expect(info.chords.sixNoteCount).toEqual(1);
  });
});
