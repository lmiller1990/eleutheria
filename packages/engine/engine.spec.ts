import { describe, it, expect } from "vitest";
import { EngineNote } from ".";
import {
  Chart,
  updateGameState,
  UpdatedGameState,
  judgeInput,
  JudgementResult,
  EngineConfiguration,
  nearestNote,
  Input,
  judge,
  GameChart,
  createChart,
} from "./engine";

const engineConfiguration: EngineConfiguration = {
  maxHitWindow: 100,
  timingWindows: undefined,
};

describe("nearestNode", () => {
  it("captures nearest note based on time and input", () => {
    const chart: Chart = {
      notes: [
        { id: "1", ms: 0, columns: [1] },
        { id: "2", ms: 500, columns: [0] },
        { id: "3", ms: 1000, columns: [1] },
      ],
    };
    const actual = nearestNote({ ms: 600, column: 1 }, chart);

    expect(actual).toBe(chart.notes[2]);
  });

  it("handles chart with no notes", () => {
    const chart: Chart = {
      notes: [],
    };
    const actual = nearestNote({ ms: 600, column: 1 }, chart);

    expect(actual).toBe(undefined);
  });

  it("handles chart with no valid notes", () => {
    const chart: Chart = {
      notes: [{ id: "1", ms: 100, columns: [0] }],
    };
    const actual = nearestNote({ ms: 600, column: 1 }, chart);

    expect(actual).toBe(undefined);
  });
});

describe("judgeInput", () => {
  it("judges input within max window", () => {
    const input: Input = {
      column: 1,
      ms: 100,
    };
    // inside max input window of 100
    const note: EngineNote = { id: "1", columns: [1], ms: 200 };
    const actual = judgeInput({
      input,
      chart: { notes: [note] },
      maxWindow: 100,
      timingWindows: undefined,
    });

    expect(actual).toEqual<JudgementResult>({
      noteId: "1",
      time: 100,
      timing: -100,
      timingWindowName: undefined,
    });
  });

  it("does not judge input outside max window", () => {
    const input: Input = {
      column: 1,
      ms: 100,
    };
    // outside max input window of 100 by 1
    const note: EngineNote = { id: "1", columns: [1], ms: 201 };
    const actual = judgeInput({
      input,
      chart: { notes: [note] },
      maxWindow: 100,
      timingWindows: undefined,
    });

    expect(actual).toBe(undefined);
  });

  it("considers timing windows when note is inside smallest window", () => {
    const note: EngineNote = { id: "1", columns: [1], ms: 100 };
    const input: Input = {
      column: 1,
      ms: 111,
    };
    const actual = judgeInput({
      input,
      chart: { notes: [note] },
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
      timing: 11,
      noteId: note.id,
      time: 111,
      timingWindowName: "perfect",
    });
  });

  it("considers timing windows when note is early inside largest window", () => {
    const note: EngineNote = { id: "1", columns: [1], ms: 100 };
    const input: Input = {
      column: 1,
      ms: 111,
    };
    const actual = judgeInput({
      input,
      chart: { notes: [note] },
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
      noteId: note.id,
      time: 111,
      timingWindowName: "great",
    });
  });

  it("considers timing windows when note is late inside largest window", () => {
    const note: EngineNote = { id: "1", columns: [1], ms: 100 };
    const input: Input = {
      column: 1,
      ms: 89,
    };

    const actual = judgeInput({
      input,
      chart: { notes: [note] },
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
      noteId: note.id,
      time: 89,
      timingWindowName: "great",
    });
  });

  it("considers timing windows when note outside all windows", () => {
    const note: EngineNote = { id: "1", columns: [1], ms: 100 };
    const input: Input = {
      column: 1,
      ms: 150,
    };
    const actual = judgeInput({
      input,
      chart: { notes: [note] },
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
    });
  });
});

describe("judge", () => {
  it("returns timing", () => {
    const input: Input = {
      column: 1,
      ms: 510,
    };
    const note: EngineNote = { id: "1", columns: [1], ms: 500 };
    const actual = judge(input, note);

    expect(actual).toBe(10);
  });

  it("awards perfect timing for hold notes", () => {
    const input: Input = {
      column: 1,
      ms: 510,
    };
    const note: EngineNote = { id: "1", columns: [1], ms: 500, dependsOn: "1" };
    const actual = judge(input, note);

    expect(actual).toBe(0);
  });
});

describe("updateGameState", () => {
  const baseNote: EngineNote = {
    id: "1",
    ms: 0,
    columns: [0],
    canHit: true,
    timingWindowName: undefined,
  };

  it("updates the world given relative to given millseconds", () => {
    const notes = new Map<string, EngineNote>();
    notes.set(baseNote.id, { ...baseNote, ms: 1000 });
    // 900 ms has passed since game started
    const current: GameChart = {
      notes,
    };

    // 50 ms has passed since last update
    const expected: UpdatedGameState = {
      chart: {
        notes,
      },
      previousFrameMeta: {
        judgementResults: [],
      },
    };

    const actual = updateGameState(
      { startTime: 0, chart: current, time: 950, inputs: [] },
      engineConfiguration
    );
    expect(actual).toEqual(expected);
  });

  it("update game state considering input", () => {
    // 900 ms has passed since game started
    const notes = new Map<string, EngineNote>();
    notes.set(baseNote.id, { ...baseNote, ms: 1000, canHit: true });
    const current: GameChart = {
      notes,
    };

    // 50 ms has passed since last update
    const expected: UpdatedGameState = {
      previousFrameMeta: {
        judgementResults: [
          {
            noteId: "1",
            time: 940,
            timing: -60,
            // no timing windows are specified, so we are just using default maxHit
            // this means the timing window is undefined.
            timingWindowName: undefined,
          },
        ],
      },
      chart: {
        notes: new Map([
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
    };

    const actual = updateGameState(
      {
        startTime: 0,
        chart: current,
        time: 950,
        inputs: [
          {
            column: baseNote.columns[0],
            ms: 940,
          },
        ],
      },
      engineConfiguration
    );

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
      notes: new Map<string, EngineNote>([
        ["1", alreadyHitNote],
        ["2", { ...upcomingNote }],
      ]),
    };

    // t = 950
    const expected: UpdatedGameState = {
      chart: {
        notes: new Map<string, EngineNote>([
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
      previousFrameMeta: {
        judgementResults: [
          {
            noteId: "2",
            time: 950,
            timing: -50,
            // no timing windows passed in config.
            timingWindowName: undefined,
          },
        ],
      },
    };

    const actual = updateGameState(
      {
        startTime: 0,
        chart: current,
        time: 950,
        inputs: [
          {
            column: baseNote.columns[0],
            ms: 950,
          },
        ],
      },
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
      notes: new Map<string, EngineNote>([[note.id, note]]),
    };

    const expected: UpdatedGameState = {
      previousFrameMeta: {
        judgementResults: [
          {
            noteId: "1",
            time: 90,
            timing: -10,
            // no timing windows passed in config.
            timingWindowName: undefined,
          },
        ],
      },
      chart: {
        notes: new Map<string, EngineNote>([[note.id, { ...note }]]),
      },
    };

    const actual = updateGameState(
      {
        startTime: 0,
        chart: current,
        time: 90,
        inputs: [
          {
            column: note.columns[0],
            ms: 90,
          },
        ],
      },
      engineConfiguration
    );

    expect(actual).toEqual(expected);
  });

  it("supports simultaneous inputs", () => {
    const aNote: EngineNote = {
      ...baseNote,
      ms: 100,
    };
    const current: GameChart = {
      notes: new Map<string, EngineNote>([
        ["1", { ...aNote, id: "1", columns: [0] }],
        ["2", { ...aNote, id: "2", columns: [1] }],
      ]),
    };

    const expected: UpdatedGameState = {
      chart: {
        notes: new Map<string, EngineNote>([
          [
            "1",
            {
              ...aNote,
              id: "1",
              columns: [0],
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
              columns: [1],
              hitAt: 100,
              canHit: false,
              hitTiming: 0,
            },
          ],
        ]),
      },
      previousFrameMeta: {
        judgementResults: [
          {
            noteId: "1",
            time: 100,
            timing: 0,
            timingWindowName: undefined,
          },
          {
            noteId: "2",
            time: 100,
            timing: 0,
            timingWindowName: undefined,
          },
        ],
      },
    };

    const actual = updateGameState(
      {
        startTime: 0,
        chart: current,
        time: 100,
        inputs: [
          {
            column: 0,
            ms: 100,
          },
          {
            column: 1,
            ms: 100,
          },
        ],
      },
      engineConfiguration
    );

    expect(actual).toEqual(expected);
  });
});

describe("createChart", () => {
  it("returns a new chart considering offset", () => {
    const expected: Chart = {
      notes: [{ id: "1", ms: 1100, columns: [0] }],
    };
    const actual = createChart({
      notes: [{ id: "1", ms: 1000, columns: [0] }],
      offset: 100,
    });

    expect(actual).toEqual(expected);
  });
});
