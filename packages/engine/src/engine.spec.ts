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
  initGameState,
} from ".";
import { createWorld } from "../test/utils";

const engineConfiguration: EngineConfiguration = {
  maxHitWindow: 100,
  timingWindows: [],
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
    timingWindowName: null,
  });

  const n1 = {
    ...baseNote,
    column: 1,
    id: "h1",
    ms: options.startMs,
    dependsOn: null,
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
    measureNumber: 0,
    timingWindowName: null,
    missed: false,
    canHit: true,
    ...note,
  };
}

describe("nearestScorableNote", () => {
  it("is quick for large number of notes", () => {
    const chart = initGameState({
      tapNotes: [
        makeTapNote({ id: "0", ms: 0, column: 1 }),
        makeTapNote({ id: "1", ms: 0, column: 0 }),
        makeTapNote({ id: "2", ms: 500, column: 0 }),
        makeTapNote({ id: "3", ms: 1000, column: 0 }),
        makeTapNote({ id: "4", ms: 1500, column: 0 }),
        makeTapNote({ id: "5", ms: 2000, column: 0 }),
        makeTapNote({ id: "6", ms: 2500, column: 0 }),
        makeTapNote({ id: "7", ms: 3000, column: 0 }),
        makeTapNote({ id: "8", ms: 3500, column: 0 }),
        makeTapNote({ id: "9", ms: 4000, column: 0 }),
        makeTapNote({ id: "10", ms: 4500, column: 0 }),
        makeTapNote({ id: "11", ms: 5000, column: 0 }),
      ],
      holdNotes: [],
    });

    const actual = nearestScorableNote(
      createInput({ ms: 4000, column: 0 }),
      chart
    );

    expect(actual).toBe(chart.tapNotes.get("9"));
  });

  it("is quick for large number of notes", () => {
    const chart = initGameState({
      tapNotes: [
        makeTapNote({ id: "1", ms: 0, column: 0 }),
        makeTapNote({ id: "2", ms: 500, column: 0 }),
        makeTapNote({ id: "3", ms: 1000, column: 0 }),
        makeTapNote({ id: "4", ms: 1500, column: 0 }),
        makeTapNote({ id: "5", ms: 2000, column: 0 }),
        makeTapNote({ id: "6", ms: 2500, column: 0 }),
        makeTapNote({ id: "7", ms: 3000, column: 0 }),
        makeTapNote({ id: "8", ms: 3500, column: 0 }),
        makeTapNote({ id: "9", ms: 4000, column: 0 }),
        makeTapNote({ id: "10", ms: 4500, column: 0 }),
        makeTapNote({ id: "11", ms: 5000, column: 0 }),
      ],
      holdNotes: [],
    });
    const actual = nearestScorableNote(
      createInput({ ms: 400, column: 0 }),
      chart
    );

    expect(actual).toBe(chart.tapNotes.get("2"));
  });

  it("is quick for large number of notes", () => {
    const chart = initGameState({
      tapNotes: [
        makeTapNote({ id: "1", ms: 0, column: 0 }),
        makeTapNote({ id: "2", ms: 500, column: 0 }),
        makeTapNote({ id: "3", ms: 1000, column: 0 }),
        makeTapNote({ id: "4", ms: 1500, column: 0 }),
        makeTapNote({ id: "5", ms: 2000, column: 0 }),
        makeTapNote({ id: "6", ms: 2500, column: 0 }),
        makeTapNote({ id: "7", ms: 3000, column: 0 }),
        makeTapNote({ id: "8", ms: 3500, column: 0 }),
        makeTapNote({ id: "9", ms: 4000, column: 0 }),
        makeTapNote({ id: "10", ms: 4500, column: 0 }),
        makeTapNote({ id: "11", ms: 5000, column: 0 }),
      ],
      holdNotes: [],
    });
    const actual = nearestScorableNote(
      createInput({ ms: 2000, column: 0 }),
      chart
    );

    expect(actual).toBe(chart.tapNotes.get("5"));
  });

  it("captures nearest note based on time and input", () => {
    const chart = initGameState({
      tapNotes: [
        makeTapNote({ id: "1", ms: 0, column: 1 }),
        makeTapNote({ id: "2", ms: 500, column: 0 }),
        makeTapNote({ id: "3", ms: 1000, column: 1 }),
      ],
      holdNotes: [],
    });

    const actual = nearestScorableNote(
      createInput({ ms: 600, column: 1 }),
      chart
    );

    expect(actual).toBe(chart.tapNotes.get("3"));
  });

  // TODO: Revive holds
  it.skip("captures nearest hold note leader based on time and input", () => {
    const chart = initGameState({
      tapNotes: [],
      holdNotes: [
        makeHoldNote({ startMs: 100, durationMs: 10 }),
        makeHoldNote({ startMs: 200, durationMs: 10 }),
      ],
    });
    const actual = nearestScorableNote(
      createInput({ ms: 110, column: 1 }),
      chart
    );

    // @ts-ignore
    expect(actual).toBe(chart.holdNotes[0][0]);
  });

  it("handles chart with no tapNotes", () => {
    const chart = initGameState({
      tapNotes: [],
      holdNotes: [],
    });
    const actual = nearestScorableNote(
      createInput({ ms: 600, column: 1 }),
      chart
    );

    expect(actual).toBeFalsy();
  });

  it("handles chart with no valid tapNotes", () => {
    const chart = initGameState({
      tapNotes: [makeTapNote({ id: "1", ms: 100, column: 0 })],
      holdNotes: [],
    });
    const actual = nearestScorableNote(
      createInput({ ms: 600, column: 1 }),
      chart
    );

    expect(actual).toBeFalsy();
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

    const chart = initGameState({
      tapNotes: [note],
      holdNotes: [],
    });

    const actual = judgeInput({
      input,
      chart,
      maxWindow: 100,
      timingWindows: undefined,
    });

    expect(actual).toEqual<JudgementResult>({
      note,
      inputs: ["100"],
      time: 100,
      timing: -100,
      timingWindowName: null,
    });
  });

  it("does not judge input outside max window", () => {
    const input: Input = createInput({
      column: 1,
      ms: 100,
    });
    // outside max input window of 100 by 1
    const note = makeTapNote({ id: "1", column: 1, ms: 201 });

    const chart = initGameState({
      tapNotes: [note],
      holdNotes: [],
    });

    const actual = judgeInput({
      input,
      chart,
      maxWindow: 100,
      timingWindows: undefined,
    });

    expect(actual).toBeFalsy();
  });

  it("considers timing windows when note is inside smallest window", () => {
    const note = makeTapNote({ id: "1", column: 1, ms: 100 });
    const input: Input = createInput({
      column: 1,
      ms: 111,
    });
    const chart = initGameState({
      tapNotes: [note],
      holdNotes: [],
    });
    const actual = judgeInput({
      input,
      chart,
      maxWindow: 100,
      timingWindows: [
        {
          name: "perfect",
          windowMs: 22,
          weight: 1,
        },
        {
          name: "great",
          windowMs: 33,
          weight: 1,
        },
      ],
    });

    expect(actual).toEqual<JudgementResult>({
      inputs: ["111"],
      timing: 11,
      note,
      time: 111,
      timingWindowName: "perfect",
    });
  });

  it("considers timing windows when note is early inside largest window", () => {
    const note = makeTapNote({ id: "1", column: 1, ms: 100 });
    const chart = initGameState({
      tapNotes: [note],
      holdNotes: [],
    });
    const input: Input = createInput({
      column: 1,
      ms: 111,
    });
    const actual = judgeInput({
      input,
      chart,
      maxWindow: 100,
      timingWindows: [
        {
          name: "perfect",
          windowMs: 10,
          weight: 1,
        },
        {
          name: "great",
          windowMs: 33,
          weight: 1,
        },
      ],
    });

    expect(actual).toEqual<JudgementResult>({
      timing: 11,
      inputs: ["111"],
      note,
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
    const chart = initGameState({
      tapNotes: [note],
      holdNotes: [],
    });

    const actual = judgeInput({
      input,
      chart,
      maxWindow: 100,
      timingWindows: [
        {
          name: "perfect",
          windowMs: 10,
          weight: 1,
        },
        {
          name: "great",
          windowMs: 33,
          weight: 1,
        },
      ],
    });

    expect(actual).toEqual<JudgementResult>({
      timing: -11,
      inputs: ["89"],
      note,
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
    const chart = initGameState({
      tapNotes: [note],
      holdNotes: [],
    });
    const actual = judgeInput({
      input,
      chart,
      maxWindow: 100,
      timingWindows: [
        {
          name: "perfect",
          windowMs: 10,
          weight: 1,
        },
        {
          name: "great",
          windowMs: 20,
          weight: 1,
        },
      ],
    });

    expect(actual).toEqual<JudgementResult>({
      timing: 50,
      note,
      time: 150,
      timingWindowName: null,
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
    timingWindowName: null,
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

  it("counts a missed note as a judgement", () => {
    // 2000 ms has passed since game started
    const n0: EngineNote = {
      ...baseNote,
      id: "0",
      ms: 900,
      canHit: false,
      missed: true,
      timingWindowName: "miss",
    };

    const n1: EngineNote = {
      ...baseNote,
      id: "1",
      ms: 1000,
      canHit: true,
    };

    const chart = initGameState({
      tapNotes: [n0, n1],
      holdNotes: [],
    });

    // 2000 ms has passed since last update
    const world = createWorld(chart, {
      combo: 0,
      startTime: 0,
      time: 2000,
      inputs: [],
    });

    const updated_n0: EngineNote = {
      ...baseNote,
      id: "0",
      ms: 900,
      missed: true,
      canHit: false,
      timingWindowName: "miss",
    };

    const updated_n1: EngineNote = {
      ...baseNote,
      id: "1",
      ms: 1000,
      missed: true,
      canHit: false,
      timingWindowName: "miss",
    };

    const expected: UpdatedGameState = {
      world: {
        ...world,
        combo: 0,
        chart: {
          holdNotes: new Map(),
          tapNotes: new Map([
            ["0", updated_n0],
            ["1", updated_n1],
          ]),
          tapNotesByColumn: new Map([
            // n1 is gone, no longer relevant for judgement
            [0, [updated_n0.id]],
          ]),
        },
      },
      previousFrameMeta: {
        comboBroken: true,
        judgementResults: [
          {
            note: updated_n1,
            time: 0,
            timing: 0,
            timingWindowName: "miss",
            inputs: [],
          },
        ],
      },
    };

    const actual = updateGameState(world, engineConfiguration);

    expect(actual).toEqual(expected);
  });

  it("update game state considering input", () => {
    // 900 ms has passed since game started
    const n0: EngineNote = { ...baseNote, ms: 1000, canHit: true };
    const chart = initGameState({
      tapNotes: [n0],
      holdNotes: [],
    });

    const world = createWorld(chart, {
      combo: 0,
      startTime: 0,
      time: 950,
      inputs: [
        createInput({
          column: baseNote.column,
          ms: 940,
        }),
      ],
    });

    // 50 ms has passed since last update
    const expected: UpdatedGameState = {
      world: {
        ...world,
        combo: 1,
        chart: {
          holdNotes: new Map(),
          tapNotes: new Map([
            [
              n0.id,
              {
                ...n0,
                ms: 1000,
                canHit: false,
                hitTiming: -60,
                hitAt: 940,
              },
            ],
          ]),
          tapNotesByColumn: new Map([
            // gone - it's judged, no longer here
            [n0.column, []],
          ]),
        },
      },
      previousFrameMeta: {
        comboBroken: false,
        judgementResults: [
          {
            note: n0,
            time: 940,
            timing: -60,
            // no timing windows are specified, so we are just using default maxHit
            // this means the timing window is null.
            timingWindowName: null,
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

    const chart: GameChart = {
      holdNotes: new Map(),
      tapNotes: new Map([
        [alreadyHitNote.id, alreadyHitNote],
        [upcomingNote.id, upcomingNote],
      ]),
      tapNotesByColumn: new Map([[upcomingNote.column, [upcomingNote.id]]]),
    };

    const world = createWorld(chart, {
      audioContext: undefined,
      source: undefined,
      combo: 0,
      startTime: 0,
      time: 950,
      inputs: [
        createInput({
          column: upcomingNote.column,
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
            ["1", alreadyHitNote],
            [
              "2",
              {
                ...upcomingNote,
                canHit: false,
                hitTiming: -50,
                hitAt: 950,
              },
            ],
          ]),
          // no note - it is hit
          tapNotesByColumn: new Map([[0, []]]),
        },
      },
      previousFrameMeta: {
        comboBroken: false,
        judgementResults: [
          {
            note: upcomingNote,
            time: 950,
            timing: -50,
            // no timing windows passed in config.
            timingWindowName: null,
            inputs: ["950"],
          },
        ],
      },
    };

    const actual = updateGameState(world, engineConfiguration);

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
      tapNotes: new Map([[note.id, note]]),
      // empty - note was already hit and removed.
      tapNotesByColumn: new Map([]),
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
    const n1: EngineNote = {
      ...baseNote,
      id: "1",
      ms: 100,
      column: 0,
    };
    const n2: EngineNote = {
      ...baseNote,
      id: "2",
      ms: 100,
      column: 1,
    };
    const current: GameChart = {
      holdNotes: new Map(),
      tapNotes: new Map<string, EngineNote>([
        ["1", n1],
        ["2", n2],
      ]),
      tapNotesByColumn: new Map([
        [n1.column, [n1.id]],
        [n2.column, [n2.id]],
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
                ...n1,
                hitAt: 100,
                canHit: false,
                hitTiming: 0,
              },
            ],
            [
              "2",
              {
                ...n2,
                hitAt: 100,
                canHit: false,
                hitTiming: 0,
              },
            ],
          ]),
          // empty - both hit
          tapNotesByColumn: new Map([
            [n1.column, []],
            [n2.column, []],
          ]),
        },
      },
      previousFrameMeta: {
        comboBroken: false,
        judgementResults: [
          {
            note: n1,
            time: 100,
            timing: 0,
            timingWindowName: null,
            inputs: ["100"],
          },
          {
            note: n2,
            time: 100,
            timing: 0,
            timingWindowName: null,
            inputs: ["100"],
          },
        ],
      },
    };

    const actual = updateGameState(world, engineConfiguration);

    expect(actual).toEqual(expected);
  });

  // TODO(holds): support hold notes
  it.skip("updates the world consider holds notes", () => {
    const holdNotes = new Map<string, EngineNote[]>();
    const h1: EngineNote[] = [
      { ...baseNote, column: 1, id: "h1", ms: 1000, dependsOn: null },
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
            note: h1[0],
            time: 1000,
            timing: 0,
            timingWindowName: null,
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
      { ...baseNote, column: 1, id: "h1", ms: 1000, dependsOn: null },
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

    // expect(actual).toEqual(expected);
  });

  // TODO(holds)
  it.skip("does hit hold inside timing window", () => {
    const holdNotes = new Map<string, EngineNote[]>();
    holdNotes.set("h1", [
      { ...baseNote, column: 1, id: "h1", ms: 1000, dependsOn: null },
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

    expect(actual.world.chart.holdNotes.get("h1")!).toEqual<EngineNote[]>([
      {
        canHit: false,
        column: 1,
        dependsOn: null,
        hitAt: 1000,
        hitTiming: 0,
        id: "h1",
        missed: false,
        ms: 1000,
        isHeld: true,
        timingWindowName: null,
        measureNumber: 0,
      },
      {
        canHit: true,
        column: 1,
        dependsOn: "h1",
        id: "h2",
        missed: false,
        ms: 1100,
        timingWindowName: null,
        measureNumber: 0,
      },
    ]);
  });

  // TODO(holds)
  it.skip("drops hold if not consistenly held", () => {
    const holdNotes = new Map<string, EngineNote[]>();
    holdNotes.set("h1", [
      { ...baseNote, column: 1, id: "h1", ms: 1000, dependsOn: null },
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

    expect(s1.world.chart.holdNotes.get("h1")!.at(0)!.isHeld).toEqual(true);
    expect(s1.previousFrameMeta.comboBroken).toEqual(false);

    const s2 = updateGameState(
      {
        ...s1.world,
        time: 1001,
        inputs: [createInput({ ms: 1001, column: 1, type: "up" })],
      },
      engineConfiguration
    );

    expect(s2.world.chart.holdNotes.get("h1")!.at(0)!.isHeld).toEqual(false);
    expect(s2.world.chart.holdNotes.get("h1")!.at(0)!.droppedAt).toEqual(1001);
    expect(s2.previousFrameMeta.comboBroken).toEqual(true);
  });

  // TODO: was this ever doing anything?
  it.skip("removes hold from activeHolds set if end of hold is passed current time", () => {
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

    // const s1 = updateGameState(world, engineConfiguration);
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
            dependsOn: null,
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
