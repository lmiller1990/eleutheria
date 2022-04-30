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

export function summarizeResults(
  world: World,
  timingWindowNames: readonly string[]
) {
  const init: Summary = {
    percent: "99.55",
    achievements: [],
    timing: {
      miss: {
        count: 0,
        early: 0,
        late: 0,
      },
    },
  };

  const summary = timingWindowNames.reduce<Summary>((acc, curr) => {
    const summary: Summary = {
      ...acc,
      timing: {
        ...acc.timing,
        [curr]: {
          early: 0,
          late: 0,
          count: 0,
        },
      },
    };

    return summary;
  }, init);

  for (const [id, note] of world.chart.tapNotes) {
    if (note.missed) {
      summary.timing.miss.count += 1;
    }

    if (
      note.timingWindowName &&
      timingWindowNames.includes(note.timingWindowName)
    ) {
      if (note.timingWindowName && !(note.timingWindowName in summary.timing)) {
        // should be impossible - defensive check.
        throw Error(
          `Tried to add note with timing ${
            note.timingWindowName
          } to summary, which is not a validate timing window. Valid windows are: ${timingWindowNames.join(
            ","
          )}`
        );
      }

      // hit note - find correct timing window.
      if (note.hitAt !== undefined) {
        // always increase count
        summary.timing[note.timingWindowName].count += 1;

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

  return summary;
}
