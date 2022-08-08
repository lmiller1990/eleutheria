import { ChartSummary } from "@packages/types";
import type { ParsedHoldNoteChart, ParsedTapNoteChart } from "./parser";

export function chartInfo(
  taps: ParsedTapNoteChart,
  holds: ParsedHoldNoteChart
): ChartSummary {
  const notes = new Map<number, number>();

  for (const n of taps.tapNotes) {
    const e = notes.get(n.ms);
    if (!e) {
      notes.set(n.ms, 1);
    } else {
      notes.set(n.ms, e + 1);
    }
  }

  for (const n of holds.holdNotes) {
    const f = n[0].ms;
    const e = notes.get(f);
    if (!e) {
      notes.set(f, 1);
    } else {
      notes.set(f, e + 1);
    }
  }

  const info: ChartSummary = {
    totalNotes: 0,
    holdNotes: 0,
    chords: {
      twoNoteCount: 0,
      threeNoteCount: 0,
      fourNoteCount: 0,
      fiveNoteCount: 0,
      sixNoteCount: 0,
    },
  };

  info.holdNotes = holds.holdNotes.length;

  for (const [_ms, c] of notes) {
    info.totalNotes += c;
    if (c === 2) info.chords.twoNoteCount++;
    if (c === 3) info.chords.threeNoteCount++;
    if (c === 4) info.chords.fourNoteCount++;
    if (c === 5) info.chords.fiveNoteCount++;
    if (c === 6) info.chords.sixNoteCount++;
  }

  return info;
}
