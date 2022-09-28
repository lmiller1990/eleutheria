import type { EngineNote, World } from "@packages/engine";
import type { SummaryData, SummaryNote } from ".";

function summaryKeysOnly(note: EngineNote): SummaryNote {
  const { id, missed, timingWindowName, hitAt, droppedAt, ms } = note;
  return { id, missed, timingWindowName, hitAt, droppedAt, ms };
}

export function extractNotesFromWorld(world: World): SummaryData {
  return {
    tapNotes: [...world.chart.tapNotes.values()].map(summaryKeysOnly),
    holdNotes: [...world.chart.holdNotes.values()].map((note) => [
      summaryKeysOnly(note[0]),
      summaryKeysOnly(note[1]),
    ]),
  };
}
