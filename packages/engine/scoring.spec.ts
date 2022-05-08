import { describe, it, expect } from "vitest";
import type { World, EngineNote } from "./engine";
import { createWorld } from "./test/utils";
import { Summary, summarizeResults } from "./scoring";

const createNote = (
  id: string,
  ms: number,
  hitAt: number | undefined,
  timingWindowName: string | undefined,
  missed: boolean
): EngineNote => ({
  id,
  ms,
  timingWindowName,
  hitAt,
  canHit: false,
  column: 0,
  missed,
});

describe("scoring", () => {
  it("summarizes results", () => {
    const expected: Summary = {
      achievements: [],
      percent: "99.55",
      timing: {
        perfect: {
          count: 3,
          early: 1,
          late: 1,
        },
        great: {
          count: 0,
          early: 0,
          late: 0,
        },
        miss: {
          count: 2,
          early: 0,
          late: 0,
        },
      },
    };

    const world: World = createWorld(
      {
        tapNotes: new Map<string, EngineNote>([
          ["1", createNote("1", 100, 110, "perfect", false)],
          ["2", createNote("2", 200, 200, "perfect", false)],
          ["3", createNote("3", 300, 290, "perfect", false)],
          ["4", createNote("4", 300, undefined, undefined, true)],
          ["5", createNote("5", 300, undefined, undefined, true)],
        ]),
      },
      {
        time: 10000,
        startTime: 0,
        inputs: [],
      }
    );

    const actual = summarizeResults(world, ["perfect", "great"]);

    expect(expected).toEqual(actual);
  });

  it("does not count future tapNotes as missed", () => {
    const expected: Summary = {
      achievements: [],
      percent: "99.55",
      timing: {
        perfect: {
          count: 0,
          early: 0,
          late: 0,
        },
        great: {
          count: 0,
          early: 0,
          late: 0,
        },
        miss: {
          count: 0,
          early: 0,
          late: 0,
        },
      },
    };

    const world: World = createWorld(
      {
        tapNotes: new Map<string, EngineNote>([
          ["1", createNote("1", 200, undefined, undefined, false)],
        ]),
      },
      {
        time: 100,
        startTime: 0,
        inputs: [],
      }
    );

    const actual = summarizeResults(world, ["perfect", "great"]);

    expect(expected).toEqual(actual);
  });
});
