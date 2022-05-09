import { describe, it, expect } from "vitest";
import type { World, EngineNote } from "./engine";
import { createWorld } from "./test/utils";
import { Summary, summarizeResults, ScoringTimingWindow } from "./scoring";

const timingWindows: ScoringTimingWindow[] = [
  {
    timingWindowName: "perfect",
    weight: 2,
  },
  {
    timingWindowName: "great",
    weight: 1,
  },
  {
    timingWindowName: "miss",
    weight: 0,
  },
];

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
      percent: "60.00",
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

    const actual = summarizeResults(world, timingWindows);

    expect(expected).toEqual(actual);
  });

  it("does not count future tapNotes as missed", () => {
    const expected: Summary = {
      achievements: [],
      percent: "0.00",
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

    const actual = summarizeResults(world, timingWindows);

    expect(expected).toEqual(actual);
  });

  it("calculates perfect percentage score of 100%", () => {
    const expected: Summary = {
      achievements: [],
      percent: "100.00",
      timing: {
        perfect: {
          count: 5,
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
          ["1", createNote("1", 100, 100, "perfect", false)],
          ["2", createNote("2", 200, 200, "perfect", false)],
          ["3", createNote("3", 300, 300, "perfect", false)],
          ["4", createNote("4", 400, 400, "perfect", false)],
          ["5", createNote("5", 500, 500, "perfect", false)],
        ]),
      },
      {
        time: 500,
        startTime: 0,
        inputs: [],
      }
    );

    const actual = summarizeResults(world, timingWindows);

    expect(expected.percent).toEqual(actual.percent);
  });

  it("calculates a non-perfect percentage score ", () => {
    const expected: Summary = {
      achievements: [],
      percent: "66.67",
      timing: {
        perfect: {
          count: 1,
          early: 0,
          late: 0,
        },
        great: {
          count: 1,
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
          ["1", createNote("1", 100, 100, "perfect", false)],
          ["2", createNote("2", 400, 450, "great", false)],
        ]),
      },
      {
        time: 500,
        startTime: 0,
        inputs: [],
      }
    );

    const actual = summarizeResults(world, timingWindows);

    expect(expected.percent).toEqual(actual.percent);
  });

  it("calculates a score for no notes", () => {
    const expected: Summary = {
      achievements: [],
      percent: "0.00",
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
        tapNotes: new Map<string, EngineNote>([]),
      },
      {
        time: 500,
        startTime: 0,
        inputs: [],
      }
    );

    const actual = summarizeResults(world, timingWindows);

    expect(expected.percent).toEqual(actual.percent);
  });
});
