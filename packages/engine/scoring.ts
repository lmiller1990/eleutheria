import type { World } from "./engine";

export interface TimingTypeSummary {
  count: number;
  early: number;
  late: number;
}

export interface Summary {
  achievements: string[];
  percent: string;
  timing: {
    [key: string]: TimingTypeSummary;
  };
}

export interface ScoringTimingWindow {
  timingWindowName: string;
  weight: number;
}

export function summarizeResults(
  world: World,
  timingWindows: ScoringTimingWindow[]
) {
  const init: Summary = {
    percent: "0.00",
    achievements: [],
    timing: {
      miss: {
        count: 0,
        early: 0,
        late: 0,
      },
    },
  };

  const windowNames = timingWindows.map((x) => x.timingWindowName);
  const totalWeight = timingWindows.reduce((acc, curr) => {
    return acc + (curr.weight > 0 ? curr.weight : 0);
  }, 0);

  const totalNotes = world.chart.holdNotes.size + world.chart.tapNotes.size;
  const bestWindow = timingWindows.reduce(
    (acc, curr) => (curr.weight > acc.weight ? curr : acc),
    timingWindows[0]
  );
  const bestValue = 100 / totalNotes;

  const weights = new Map(
    timingWindows.map((win) => {
      if (win.timingWindowName === bestWindow.timingWindowName) {
        return [win.timingWindowName, bestValue];
      }
      return [win.timingWindowName, bestValue * (win.weight / totalWeight)];
    })
  );

  const summary = timingWindows.reduce<Summary>((acc, curr) => {
    const summary: Summary = {
      ...acc,
      timing: {
        ...acc.timing,
        [curr.timingWindowName]: {
          early: 0,
          late: 0,
          count: 0,
        },
      },
    };

    return summary;
  }, init);

  let percent = 0;

  for (const [id, note] of world.chart.tapNotes) {
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
      if (note.hitAt !== undefined) {
        // always increase count
        summary.timing[note.timingWindowName].count += 1;
        percent += weights.get(note.timingWindowName)!;

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
    percent: percent.toFixed(2),
  };
}
