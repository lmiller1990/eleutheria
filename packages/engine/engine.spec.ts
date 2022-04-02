import { describe, it, expect } from "vitest";
import type { EngineNote } from ".";
import {
  Chart,
  updateGameState,
  UpdatedGameState,
  judgeInput,
  JudgementResult,
  EngineConfiguration,
  nearestScorableNote,
  Input,
  judge,
  GameChart,
  createChart,
} from "./engine";
import { createWorld } from "./test/utils";

const engineConfiguration: EngineConfiguration = {
  maxHitWindow: 100,
  timingWindows: undefined,
};

const createInput = ({
  ms,
  column,
  type = "down",
}: {
  ms: number;
  column: number;
  type?: "up" | "down";
}): Input => ({
  id: ms.toString(),
  ms,
  column,
  type,
});

function makeHoldNote(options: {
  startMs: number;
  durationMs: number;
}): EngineNote[] {
  const baseNote = makeTapNote({
    id: "1",
    ms: 0,
    column: 0,
    canHit: true,
    timingWindowName: undefined,
  });

  const n1 = {
    ...baseNote,
    column: 1,
    id: "h1",
    ms: options.startMs,
    dependsOn: undefined,
  };

  const n2 = {
    ...baseNote,
    column: 1,
    id: "h2",
    ms: options.startMs + options.durationMs,
    dependsOn: "h1",
  };

  return [n1, n2];
}

function makeTapNote(note: Partial<EngineNote>): EngineNote {
  return {
    id: "???",
    column: 0,
    ms: 0,
    missed: false,
    canHit: true,
    ...note,
  };
}

describe("nearestScorableNote", () => {
  it("captures nearest note based on time and input", () => {
    const chart: Chart = {
      tapNotes: [
        makeTapNote({ id: "1", ms: 0, column: 1 }),
        makeTapNote({ id: "2", ms: 500, column: 0 }),
        makeTapNote({ id: "3", ms: 1000, column: 1 }),
      ],
      holdNotes: [],
    };
    const actual = nearestScorableNote(
      createInput({ ms: 600, column: 1 }),
      chart
    );

    expect(actual).toBe(chart.tapNotes[2]);
  });

  it("captures nearest hold note leader based on time and input", () => {
    const chart: Chart = {
      tapNotes: [],
      holdNotes: [
        makeHoldNote({ startMs: 100, durationMs: 10 }),
        makeHoldNote({ startMs: 200, durationMs: 10 }),
      ],
    };
    const actual = nearestScorableNote(
      createInput({ ms: 110, column: 1 }),
      chart
    );

    expect(actual).toBe(chart.holdNotes[0][0]);
  });

  it("handles chart with no tapNotes", () => {
    const chart: Chart = {
      tapNotes: [],
      holdNotes: [],
    };
    const actual = nearestScorableNote(
      createInput({ ms: 600, column: 1 }),
      chart
    );

    expect(actual).toBe(undefined);
  });

  it("handles chart with no valid tapNotes", () => {
    const chart: Chart = {
      tapNotes: [makeTapNote({ id: "1", ms: 100, column: 0 })],
      holdNotes: [],
    };
    const actual = nearestScorableNote(
      createInput({ ms: 600, column: 1 }),
      chart
    );

    expect(actual).toBe(undefined);
  });

  it("ignores notes that have been hit already", () => {
    const chart: Chart = {
      tapNotes: [
        makeTapNote({ id: "1", ms: 450, column: 1, hitAt: 450, canHit: false }),
        makeTapNote({ id: "2", ms: 500, column: 1 }),
      ],
      holdNotes: [],
    };
    const actual = nearestScorableNote(
      createInput({ ms: 450, column: 1 }),
      chart
    );

    expect(actual).toBe(chart.tapNotes[1]);
  });
});

describe("judgeInput", () => {
  it("judges input within max window", () => {
    const input: Input = createInput({
      column: 1,
      ms: 100,
    });
    // inside max input window of 100
    const note: EngineNote = makeTapNote({ id: "1", column: 1, ms: 200 });
    const actual = judgeInput({
      input,
      chart: { tapNotes: [note], holdNotes: [] },
      maxWindow: 100,
      timingWindows: undefined,
    });

    expect(actual).toEqual<JudgementResult>({
      noteId: "1",
      inputs: ["100"],
      time: 100,
      timing: -100,
      timingWindowName: undefined,
    });
  });

  it("does not judge input outside max window", () => {
    const input: Input = createInput({
      column: 1,
      ms: 100,
    });
    // outside max input window of 100 by 1
    const note = makeTapNote({ id: "1", column: 1, ms: 201 });
    const actual = judgeInput({
      input,
      chart: { tapNotes: [note], holdNotes: [] },
      maxWindow: 100,
      timingWindows: undefined,
    });

    expect(actual).toBe(undefined);
  });

  it("considers timing windows when note is inside smallest window", () => {
    const note = makeTapNote({ id: "1", column: 1, ms: 100 });
    const input: Input = createInput({
      column: 1,
      ms: 111,
    });
    const actual = judgeInput({
      input,
      chart: { tapNotes: [note], holdNotes: [] },
      maxWindow: 100,
      timingWindows: [
        {
          name: "perfect",
          windowMs: 22,
        },
        {
          name: "great",
          windowMs: 33,
        },
      ],
    });

    expect(actual).toEqual<JudgementResult>({
      inputs: ["111"],
      timing: 11,
      noteId: note.id,
      time: 111,
      timingWindowName: "perfect",
    });
  });

  it("considers timing windows when note is early inside largest window", () => {
    const note = makeTapNote({ id: "1", column: 1, ms: 100 });
    const input: Input = createInput({
      column: 1,
      ms: 111,
    });
    const actual = judgeInput({
      input,
      chart: { tapNotes: [note], holdNotes: [] },
      maxWindow: 100,
      timingWindows: [
        {
          name: "perfect",
          windowMs: 10,
        },
        {
          name: "great",
          windowMs: 33,
        },
      ],
    });

    expect(actual).toEqual<JudgementResult>({
      timing: 11,
      inputs: ["111"],
      noteId: note.id,
      time: 111,
      timingWindowName: "great",
    });
  });

  it("considers timing windows when note is late inside largest window", () => {
    const note = makeTapNote({ id: "1", column: 1, ms: 100 });
    const input: Input = createInput({
      column: 1,
      ms: 89,
    });

    const actual = judgeInput({
      input,
      chart: { tapNotes: [note], holdNotes: [] },
      maxWindow: 100,
      timingWindows: [
        {
          name: "perfect",
          windowMs: 10,
        },
        {
          name: "great",
          windowMs: 33,
        },
      ],
    });

    expect(actual).toEqual<JudgementResult>({
      timing: -11,
      inputs: ["89"],
      noteId: note.id,
      time: 89,
      timingWindowName: "great",
    });
  });

  it("considers timing windows when note outside all windows", () => {
    const note = makeTapNote({ id: "1", column: 1, ms: 100 });
    const input: Input = createInput({
      column: 1,
      ms: 150,
    });
    const actual = judgeInput({
      input,
      chart: { tapNotes: [note], holdNotes: [] },
      maxWindow: 100,
      timingWindows: [
        {
          name: "perfect",
          windowMs: 10,
        },
        {
          name: "great",
          windowMs: 20,
        },
      ],
    });

    expect(actual).toEqual<JudgementResult>({
      timing: 50,
      noteId: note.id,
      time: 150,
      timingWindowName: undefined,
      inputs: ["150"],
    });
  });
});

describe("judge", () => {
  it("returns timing", () => {
    const input: Input = createInput({
      column: 1,
      ms: 510,
    });
    const note = makeTapNote({ id: "1", column: 1, ms: 500 });
    const actual = judge(input, note);

    expect(actual).toBe(10);
  });

  it("awards perfect timing for hold tapNotes", () => {
    const input: Input = createInput({
      column: 1,
      ms: 510,
    });
    const note = makeTapNote({ id: "1", column: 1, ms: 500, dependsOn: "1" });
    const actual = judge(input, note);

    expect(actual).toBe(0);
  });
});

describe("updateGameState", () => {
  const baseNote = makeTapNote({
    id: "1",
    ms: 0,
    column: 0,
    canHit: true,
    timingWindowName: undefined,
  });

  it("updates the world given relative to given millseconds", () => {
    const tapNotes = new Map<string, EngineNote>();
    tapNotes.set(baseNote.id, { ...baseNote, ms: 1000 });
    // 900 ms has passed since game started

    const world = createWorld(
      { tapNotes },
      {
        t0: 0,
        startTime: 0,
        time: 950,
        inputs: [],
        combo: 0,
        audioContext: undefined,
        source: undefined,
      }
    );

    // 50 ms has passed since last update
    const expected: UpdatedGameState = {
      world: createWorld(
        { tapNotes },
        {
          ...world,
          activeHolds: new Set(),
          combo: 0,
        }
      ),
      previousFrameMeta: {
        judgementResults: [],
        comboBroken: false,
      },
    };

    const actual = updateGameState(world, engineConfiguration);

    expect(actual).toEqual(expected);
  });

  it("judges tapNotes as missed if outside max timing window", () => {
    const tapNotes = new Map<string, EngineNote>();
    tapNotes.set(baseNote.id, { ...baseNote, ms: 1000 });
    // 900 ms has passed since game started

    const world = createWorld(
      { tapNotes },
      {
        startTime: 0,
        time: 950,
        inputs: [],
        combo: 0,
        audioContext: undefined,
        source: undefined,
      }
    );

    // 50 ms has passed since last update
    const expected: UpdatedGameState = {
      world: createWorld(
        { tapNotes },
        {
          ...world,
          combo: 0,
        }
      ),
      previousFrameMeta: {
        judgementResults: [],
        comboBroken: false,
      },
    };

    const actual = updateGameState(world, engineConfiguration);
    expect(actual).toEqual(expected);
  });

  it("update game state considering input", () => {
    // 900 ms has passed since game started
    const tapNotes = new Map<string, EngineNote>();
    tapNotes.set(baseNote.id, { ...baseNote, ms: 1000, canHit: true });

    const world = createWorld(
      { tapNotes },
      {
        combo: 0,
        startTime: 0,
        time: 950,
        inputs: [
          createInput({
            column: baseNote.column,
            ms: 940,
          }),
        ],
      }
    );

    // 50 ms has passed since last update
    const expected: UpdatedGameState = {
      world: {
        ...world,
        combo: 1,
        chart: {
          holdNotes: new Map(),
          tapNotes: new Map([
            [
              baseNote.id,
              {
                ...baseNote,
                ms: 1000,
                canHit: false,
                hitTiming: -60,
                hitAt: 940,
              },
            ],
          ]),
        },
      },
      previousFrameMeta: {
        comboBroken: false,
        judgementResults: [
          {
            noteId: "1",
            time: 940,
            timing: -60,
            // no timing windows are specified, so we are just using default maxHit
            // this means the timing window is undefined.
            timingWindowName: undefined,
            inputs: ["940"],
          },
        ],
      },
    };

    const actual = updateGameState(world, engineConfiguration);

    expect(actual).toEqual(expected);
  });

  it("maintains existing state", () => {
    // t = 400
    const alreadyHitNote: EngineNote = {
      ...baseNote,
      id: "1",
      ms: 500,
      canHit: false,
      hitTiming: -100,
    };

    const upcomingNote: EngineNote = {
      ...baseNote,
      id: "2",
      ms: 1000,
      canHit: true,
    };

    const current: GameChart = {
      holdNotes: new Map(),
      tapNotes: new Map<string, EngineNote>([
        ["1", alreadyHitNote],
        ["2", { ...upcomingNote }],
      ]),
    };

    const world = createWorld(current, {
      audioContext: undefined,
      source: undefined,
      combo: 0,
      startTime: 0,
      time: 950,
      inputs: [
        createInput({
          column: baseNote.column,
          ms: 950,
        }),
      ],
    });

    // t = 950
    const expected: UpdatedGameState = {
      world: {
        ...world,
        combo: 1,
        chart: {
          holdNotes: new Map(),
          tapNotes: new Map<string, EngineNote>([
            [
              "1",
              {
                ...alreadyHitNote,
                id: "1",
              },
            ],
            [
              "2",
              {
                ...upcomingNote,
                id: "2",
                ms: 1000,
                canHit: false,
                hitTiming: -50,
                hitAt: 950,
              },
            ],
          ]),
        },
      },
      previousFrameMeta: {
        comboBroken: false,
        judgementResults: [
          {
            noteId: "2",
            time: 950,
            timing: -50,
            // no timing windows passed in config.
            timingWindowName: undefined,
            inputs: ["950"],
          },
        ],
      },
    };

    const actual = updateGameState(
      world,

      engineConfiguration
    );

    expect(actual).toEqual(expected);
  });

  it("does not allow hitting same note twice", () => {
    const note: EngineNote = {
      ...baseNote,
      ms: 100,
      canHit: false,
      hitAt: 100,
      hitTiming: 0,
    };

    const current: GameChart = {
      holdNotes: new Map(),
      tapNotes: new Map<string, EngineNote>([[note.id, note]]),
    };

    const world = createWorld(current, {
      combo: 0,
      startTime: 0,
      time: 90,
      inputs: [
        createInput({
          column: note.column,
          ms: 90,
        }),
      ],
    });

    const expected: UpdatedGameState = {
      world: {
        ...world,
        combo: 0,
        chart: {
          holdNotes: new Map(),
          tapNotes: new Map<string, EngineNote>([[note.id, { ...note }]]),
        },
      },
      previousFrameMeta: {
        comboBroken: false,
        judgementResults: [],
      },
    };

    const actual = updateGameState(world, engineConfiguration);

    expect(actual).toEqual(expected);
  });

  it("supports simultaneous inputs", () => {
    const aNote: EngineNote = {
      ...baseNote,
      ms: 100,
    };
    const current: GameChart = {
      holdNotes: new Map(),
      tapNotes: new Map<string, EngineNote>([
        ["1", { ...aNote, id: "1", column: 0 }],
        ["2", { ...aNote, id: "2", column: 1 }],
      ]),
    };

    const world = createWorld(current, {
      audioContext: undefined,
      source: undefined,
      combo: 0,
      startTime: 0,
      chart: current,
      time: 100,
      inputs: [
        createInput({
          column: 0,
          ms: 100,
        }),
        createInput({
          column: 1,
          ms: 100,
        }),
      ],
    });

    const expected: UpdatedGameState = {
      world: {
        ...world,
        combo: 2,
        chart: {
          holdNotes: new Map(),
          tapNotes: new Map<string, EngineNote>([
            [
              "1",
              {
                ...aNote,
                id: "1",
                column: 0,
                hitAt: 100,
                canHit: false,
                hitTiming: 0,
              },
            ],
            [
              "2",
              {
                ...aNote,
                id: "2",
                column: 1,
                hitAt: 100,
                canHit: false,
                hitTiming: 0,
              },
            ],
          ]),
        },
      },
      previousFrameMeta: {
        comboBroken: false,
        judgementResults: [
          {
            noteId: "1",
            time: 100,
            timing: 0,
            timingWindowName: undefined,
            inputs: ["100"],
          },
          {
            noteId: "2",
            time: 100,
            timing: 0,
            timingWindowName: undefined,
            inputs: ["100"],
          },
        ],
      },
    };

    const actual = updateGameState(world, engineConfiguration);

    expect(actual).toEqual(expected);
  });

  it("updates the world consider holds notes", () => {
    const holdNotes = new Map<string, EngineNote[]>();
    const h1: EngineNote[] = [
      { ...baseNote, column: 1, id: "h1", ms: 1000, dependsOn: undefined },
      { ...baseNote, column: 1, id: "h2", ms: 1100, dependsOn: "h1" },
    ];
    holdNotes.set("h1", h1);

    const world = createWorld(
      { holdNotes },
      {
        t0: 0,
        startTime: 0,
        time: 1000,
        inputs: [createInput({ ms: 1000, column: 1 })],
        combo: 0,
        audioContext: undefined,
        source: undefined,
      }
    );

    const expectedHoldNotes: Map<string, EngineNote[]> = new Map([
      [
        "h1",
        [
          { ...h1[0], hitAt: 1000, canHit: false, hitTiming: 0, isHeld: true },
          h1[1],
        ],
      ],
    ]);
    // 50 ms has passed since last update
    const expected: UpdatedGameState = {
      world: createWorld(
        {
          holdNotes: expectedHoldNotes,
        },
        {
          ...world,
          combo: 1,
        }
      ),
      previousFrameMeta: {
        judgementResults: [
          {
            inputs: ["1000"],
            noteId: "h1",
            time: 1000,
            timing: 0,
            timingWindowName: undefined,
          },
        ],
        comboBroken: false,
      },
    };

    const actual = updateGameState(world, engineConfiguration);

    expect(actual).toEqual(expected);
  });

  it("does not hit hold outside timing window", () => {
    const holdNotes = new Map<string, EngineNote[]>();
    holdNotes.set("h1", [
      { ...baseNote, column: 1, id: "h1", ms: 1000, dependsOn: undefined },
      { ...baseNote, column: 1, id: "h2", ms: 1100, dependsOn: "h1" },
    ]);

    const world = createWorld(
      { holdNotes },
      {
        t0: 0,
        startTime: 0,
        time: 800,
        inputs: [createInput({ ms: 800, column: 1 })],
        combo: 0,
        audioContext: undefined,
        source: undefined,
      }
    );

    const actual = updateGameState(world, engineConfiguration);

    expect(actual.world.activeHolds).toEqual(new Set());
    // expect(actual).toEqual(expected);
  });

  it("does hit hold inside timing window", () => {
    const holdNotes = new Map<string, EngineNote[]>();
    holdNotes.set("h1", [
      { ...baseNote, column: 1, id: "h1", ms: 1000, dependsOn: undefined },
      { ...baseNote, column: 1, id: "h2", ms: 1100, dependsOn: "h1" },
    ]);

    const world = createWorld(
      { holdNotes },
      {
        t0: 0,
        startTime: 0,
        time: 1000,
        inputs: [createInput({ ms: 1000, column: 1 })],
        combo: 0,
        audioContext: undefined,
        source: undefined,
      }
    );

    const actual = updateGameState(world, engineConfiguration);

    expect(actual.world.activeHolds).toEqual(new Set(["h1"]));
    expect(actual.world.chart.holdNotes.get("h1")!).toEqual([
      {
        canHit: false,
        column: 1,
        dependsOn: undefined,
        hitAt: 1000,
        hitTiming: 0,
        id: "h1",
        missed: false,
        ms: 1000,
        isHeld: true,
        timingWindowName: undefined,
      },
      {
        canHit: true,
        column: 1,
        dependsOn: "h1",
        id: "h2",
        missed: false,
        ms: 1100,
        timingWindowName: undefined,
      },
    ]);
  });

  it("drops hold if not consistenly held", () => {
    const holdNotes = new Map<string, EngineNote[]>();
    holdNotes.set("h1", [
      { ...baseNote, column: 1, id: "h1", ms: 1000, dependsOn: undefined },
      { ...baseNote, column: 1, id: "h2", ms: 1100, dependsOn: "h1" },
    ]);

    const world = createWorld(
      { holdNotes },
      {
        t0: 0,
        startTime: 0,
        time: 1000,
        inputs: [createInput({ ms: 1000, column: 1, type: "down" })],
        combo: 0,
        audioContext: undefined,
        source: undefined,
      }
    );

    const s1 = updateGameState(world, engineConfiguration);

    expect(s1.world.activeHolds).toEqual(new Set(["h1"]));
    expect(s1.world.chart.holdNotes.get("h1")!.at(0)!.isHeld).toEqual(true);
    expect(s1.previousFrameMeta.comboBroken).toEqual(false);

    const s2 = updateGameState(
      {
        ...s1.world,
        inputs: [createInput({ ms: 1001, column: 1, type: "up" })],
      },
      engineConfiguration
    );

    expect(s2.world.activeHolds).toEqual(new Set());
    expect(s1.world.chart.holdNotes.get("h1")!.at(0)!.isHeld).toEqual(false);
    expect(s2.previousFrameMeta.comboBroken).toEqual(true);
  });

  it("removes hold from activeHolds set if end of hold is passed current time", () => {
    const world = createWorld(
      {
        holdNotes: new Map([
          ["h1", makeHoldNote({ startMs: 100, durationMs: 100 })],
        ]),
      },
      {
        t0: 0,
        startTime: 0,
        time: 100,
        inputs: [createInput({ ms: 100, column: 1, type: "down" })],
        combo: 0,
        audioContext: undefined,
        source: undefined,
      }
    );

    const s1 = updateGameState(world, engineConfiguration);

    expect(s1.world.activeHolds).toEqual(new Set(["h1"]));

    const s2 = updateGameState(
      {
        ...s1.world,
        time: 201,
        inputs: [],
      },
      engineConfiguration
    );

    expect(s2.world.activeHolds).toEqual(new Set());
  });
});

describe("createChart", () => {
  it("returns a new chart considering offset", () => {
    const expected: Chart = {
      tapNotes: [makeTapNote({ id: "1", ms: 1100, column: 0 })],
      holdNotes: [
        [
          makeTapNote({
            id: "hold-1",
            ms: 1100,
            column: 1,
            dependsOn: undefined,
          }),
          makeTapNote({
            id: "hold-2",
            ms: 1150,
            column: 1,
            dependsOn: "hold-1",
          }),
        ],
      ],
    };

    const actual = createChart({
      tapNotes: [makeTapNote({ id: "1", ms: 1000, column: 0 })],
      holdNotes: [
        [
          makeTapNote({ id: "hold-1", ms: 1000, column: 1 }),
          makeTapNote({ id: "hold-2", ms: 1050, column: 1 }),
        ],
      ],
      offset: 100,
    });

    expect(actual).toEqual(expected);
  });
});
