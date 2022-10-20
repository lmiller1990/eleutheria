import type { TimingWindow, EngineNote } from "@packages/engine";

export const timingWindows = [
  {
    name: "absolute",
    windowMs: 25,
    weight: 2,
  },
  {
    name: "perfect",
    windowMs: 50,
    weight: 1,
  },
] as const;

export interface TimingTypeSummary {
  count: number;
  early: number;
  late: number;
}

export interface Summary {
  achievements: string[];
  percent: number;
  timing: {
    [key: string]: TimingTypeSummary;
  };
}

export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};

const summaryKeys = [
  "id",
  "missed",
  "timingWindowName",
  "hitAt",
  "droppedAt",
  "ms",
] as const;

export type SummaryNote = Pick<EngineNote, typeof summaryKeys[number]>;

export interface SummaryData {
  holdNotes: SummaryNote[][];
  tapNotes: SummaryNote[];
}

export function summarizeResults(
  data: SummaryData,
  timingWindows: Readonly<TimingWindow[]>
): Summary {
  const init: Summary = {
    percent: 0,
    achievements: [],
    timing: {
      miss: {
        count: 0,
        early: 0,
        late: 0,
      },
    },
  };

  const windowNames = timingWindows.map((x) => x.name);
  const totalWeight = timingWindows.reduce((acc, curr) => {
    return acc + (curr.weight > 0 ? curr.weight : 0);
  }, 0);

  const totalNotes = data.holdNotes.length + data.tapNotes.length;
  const bestWindow = timingWindows.reduce(
    (acc, curr) => (curr.weight > acc.weight ? curr : acc),
    timingWindows[0]
  );
  const bestValue = 100 / totalNotes;

  const weights = new Map(
    timingWindows.map((win) => {
      if (win.name === bestWindow.name) {
        return [win.name, bestValue];
      }
      return [win.name, bestValue * (win.weight / totalWeight)];
    })
  );

  const summary = timingWindows.reduce<Summary>((acc, curr) => {
    const summary: Summary = {
      ...acc,
      timing: {
        ...acc.timing,
        [curr.name]: {
          early: 0,
          late: 0,
          count: 0,
        },
      },
    };

    return summary;
  }, init);

  let percent = 0;

  const allNotes: SummaryNote[] = data.tapNotes.concat(
    data.holdNotes.map((x) => x[0])
  );

  for (const note of allNotes) {
    if (note.missed) {
      summary.timing.miss.count += 1;
    }

    if (note.timingWindowName && windowNames.includes(note.timingWindowName)) {
      if (note.timingWindowName && !(note.timingWindowName in summary.timing)) {
        // should be impossible - defensive check.
        throw Error(
          `Tried to add note with timing ${
            note.timingWindowName
          } to summary, which is not a validate timing window. Valid windows are: ${windowNames.join(
            ","
          )}`
        );
      }

      // hit note - find correct timing window.
      if (note.hitAt) {
        // always increase count
        summary.timing[note.timingWindowName].count += 1;

        if (note.droppedAt) {
          // deduct half the score - to get max points for a hold,
          // you must successfully hit the head and hold until the tail.
          percent += weights.get(note.timingWindowName)! / 2;
        } else {
          // maximum points
          percent += weights.get(note.timingWindowName)!;
        }

        // early
        if (note.hitAt < note.ms) {
          summary.timing[note.timingWindowName].early += 1;
        }

        // late
        if (note.hitAt > note.ms) {
          summary.timing[note.timingWindowName].late += 1;
        }
      }
    }
  }

  return {
    ...summary,
    percent: parseFloat(percent.toFixed(2)),
  };
}
