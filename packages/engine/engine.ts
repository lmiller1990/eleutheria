import { InputManager } from "./inputManager";

type HoldNote = EngineNote[];
/**
 * Represents an input from the user.
 * ms is the time of the input in millseconds since
 * the start of the game.
 * Code represents the key - this can be a virtual key, too.
 */
export interface Input {
  id: string;
  column: number;
  ms: number;
  type: "up" | "down";
}

/**
 * Represents the abstract idea of a Note, for example in a note chart you load from a text file, etc.
 */
export interface EngineNote {
  /**
   * Just an id. Usually numeric, but it can be anything.
   */
  id: string;

  /**
   * ms from start of song given a constant bpm
   */
  ms: number;

  // 0, 1, 2, 3...
  column: number;

  // the note has been missed; never to be hit
  missed: boolean;

  /**
   * This note can only be hit if the note it dependsOn
   * has been hit, too. Useful for holds.
   * dependsOn will point to another EngineNote.id.
   */
  dependsOn?: string;

  /**
   * Can the note be hit? Some notes cannot be hit,
   * either because they've already been hit, or
   * as part of some weird gameplay mechanic.
   */
  canHit: boolean;

  /**
   * Difference in ms between the time the note was supposed
   * to be hit and the actual time it was hit.
   */
  hitTiming?: number;

  /**
   * Time the note was hit, in ms, since the start of the song.
   */
  hitAt?: number;

  /**
   * If the note was hit, the name of the relevant timing window.
   */
  timingWindowName?: string;
}

/**
 * Definition of a timing window.
 * name: "fanastic", "exellent", etc
 *
 * windowMs: size of window in ms. If a window is 22ms,
 * that means a note can be hit +- 11ms either side.
 * For example, if the windowMs is 22ms, and the note should be
 * hit at 300ms, an nput at 289ms or 311m are within the window,
 * but 288ms and 312ms are not.
 */
export interface TimingWindow {
  name: string;
  windowMs: number;
}

export interface Chart {
  tapNotes: EngineNote[];
  holdNotes: Array<EngineNote[]>;
}

export interface EngineConfiguration {
  maxHitWindow: number;
  timingWindows?: TimingWindow[];
}

interface CreateChart {
  offset: number;
  tapNotes: EngineNote[];
  holdNotes: Array<EngineNote[]>;
}

/**
 * Creates a new chart.
 * Handles things like offsetting the notes.
 *
 * It takes a Note generic parameter so developers may
 * add additional properties to their notes, for example
 * to keep track of UI state, etc.
 */
export function createChart(args: CreateChart): Chart {
  return {
    tapNotes: args.tapNotes.map((note) => {
      return {
        ...note,
        ms: note.ms + args.offset,
      };
    }),
    holdNotes: args.holdNotes.map<EngineNote[]>((notes) => {
      return notes.map((note, idx) => {
        return {
          ...note,
          ms: note.ms + args.offset,
          missed: false,
          canHit: true,
          dependsOn: idx === 0 ? undefined : notes[idx - 1].id,
        };
      });
    }),
  };
}

/**
 * Finds the "nearest" note given an input and a chart for scoring.
 */
export function nearestScorableNote(
  input: Input,
  chart: Chart
): EngineNote | undefined {
  const tapable = [...chart.tapNotes, ...chart.holdNotes.map((x) => x.at(0)!)];

  const initialCandidate = tapable.find(
    (note) => note.column === input.column && note.canHit
  );

  if (!initialCandidate) {
    return undefined;
  }

  const nearest = tapable.reduce((best, note) => {
    // if the note is not scorable, we are not interested
    if (!note.canHit) {
      return best;
    }

    // if it's the wrong column, we are not interested.
    if (input.column !== note.column) {
      return best;
    }

    const isCloserToInputMs =
      Math.abs(note.ms - input.ms) <= Math.abs(best.ms - input.ms);
    // if it's the coreect column and closer to the input ms
    // than the current best, we have a new best note.
    if (isCloserToInputMs) {
      return note;
    }

    return best;
  }, initialCandidate);

  return nearest && nearest.column === input.column ? nearest : undefined;
}

/**
 * Get the difference between the time the note should have been hit
 * and the actual time it was hit.
 * Useful for scoring systems.
 *
 * If a note depends on a previous one, it's a "hold note". We assume
 * if the user hit that note, it's during a "hold", which means we
 * aware them perfect timing. A hold note is considered perfect if it was held -
 * this means hitting it anywhere in the valid window.
 */
export function judge(input: Input, note: EngineNote): number {
  if (note.dependsOn) {
    return 0;
  }

  return input.ms - note.ms;
}

export interface GameChart {
  tapNotes: Map<string, EngineNote>;
  holdNotes: Map<string, EngineNote[]>;
}

/**
 * Represents the current state of the game engine.
 */
export interface World {
  // The chart selected.
  chart: GameChart;

  // startTime (for example from performance.now()) the game was initialized.
  startTime: number;

  // How fast we have progressed since the song started.
  time: number;

  readonly combo: number;

  // Array of inputs made by the user.
  inputs: Input[];

  // audio context that plays the song
  audioContext: AudioContext;

  // actual souce that is hooked up to the audio context
  source: AudioBufferSourceNode;

  inputManager: InputManager;

  // time (from performance.now()) when the song started playing
  t0: number;

  // is the song over? This is defined as no more remaining notes
  // does not consider if the actual music is finished playback or not.
  readonly songCompleted: boolean;

  // Set of active holds - that is, a hold that satisifes
  // startOfHoldMs < world.time < endOfHoldMs
  // it's "over" the targets - the head of of the hold is
  // passed the targets, but the tail is not.
  // It's a list of `EngineNote.id`, where `id` for holds
  // is prefixed with h, eg h1, h23, etc.
  activeHolds: Set<string>;
}

export interface JudgementResult {
  // the noteId used in this judgement.
  noteId: string;

  // how accurate the timing was. + is early. - is late.
  timing: number;

  // the time in ms the input was made.
  time: number;

  // scored timing window, if available
  timingWindowName: string | undefined;

  // id of the input(s) used for this judgement
  inputs: string[];
}

/**
 * timing is a number representing how close to the actual ms
 * the note was hit.
 * A positive value represents early.
 * For example, timing = 110, desired time = 100, timing is +10.
 * A negative value represents early.
 * For example, timing = 90, desired time = 100, timing is -10.
 *
 * timingWindows is an array of windows, always ordered from smallest to largest.
 */
function getTimingWindow(
  timing: number,
  timingWindows: TimingWindow[]
): TimingWindow | undefined {
  // to make things nice and fast, we use a heuristic:
  // timingWindows is always sorted from
  // smallest to largest. Ignore windows that are too small
  // return the first window that the timing fits in.

  for (let i = 0; i < timingWindows.length; i++) {
    // divide by 2 because a window of 22ms, for example, actually means
    // "+= 11ms either side of the note"
    const windowSize = timingWindows[i].windowMs / 2;
    const normalizedTiming = Math.abs(timing / 2);

    if (normalizedTiming <= windowSize) {
      return timingWindows[i];
    }
  }

  return undefined;
}

interface JudgeInput {
  // user input
  input: Input;

  // current chart
  chart: Chart;

  // maximum window to hit a note
  maxWindow: number;

  // developer supplied timing windows
  timingWindows: TimingWindow[] | undefined;
}

/**
 * Given an input and a chart, see if there is a note nearby and judge
 * how accurately the player hit it.
 */
export function judgeInput({
  input,
  chart,
  maxWindow,
  timingWindows,
}: JudgeInput): JudgementResult | undefined {
  const note = nearestScorableNote(input, chart);

  if (note && Math.abs(note.ms - input.ms) <= maxWindow) {
    const timing = judge(input, note);
    return {
      timing,
      noteId: note.id,
      time: input.ms,
      inputs: input ? [input.id] : [],
      timingWindowName: timingWindows
        ? getTimingWindow(timing, timingWindows)?.name
        : undefined,
    };
  }
}

/**
 *  Create a new "world", which represents the play-through of one chart.
 */
export function initGameState(chart: Chart): GameChart {
  const tapNotes = new Map<string, EngineNote>();

  chart.tapNotes.forEach((note) => {
    tapNotes.set(note.id, {
      ...note,
      timingWindowName: undefined,
      canHit: true,
    });
  });

  const holdNotes = new Map<string, EngineNote[]>();

  chart.holdNotes.forEach((notes) => {
    holdNotes.set(
      notes[0].id,
      notes.map((note) => ({
        ...note,
        timingWindowName: undefined,
        canHit: true,
      }))
    );
  });

  return {
    tapNotes,
    holdNotes,
  };
}

export interface PreviousFrameMeta {
  judgementResults: JudgementResult[];
  comboBroken: boolean;
}

export interface UpdatedGameState {
  readonly world: World;
  readonly previousFrameMeta: PreviousFrameMeta;
}

function processNoteJudgement(
  note: EngineNote,
  judgementResults: JudgementResult[],
  time: number,
  maxWindowMs: number
): EngineNote {
  if (!note.canHit || !judgementResults) {
    return note;
  }

  const noteJudgement = judgementResults.find((x) => x.noteId === note.id);

  // the note was hit! update to reflect this.
  if (noteJudgement && noteJudgement.noteId === note.id) {
    return {
      ...note,
      hitAt: noteJudgement.time,
      canHit: false,
      hitTiming: noteJudgement.timing,
      timingWindowName: noteJudgement.timingWindowName,
    };
  }

  // the note is past the max timing window and can no longer be hit
  // it is considered "missed"
  if (note.hitAt === undefined && note.ms < time - maxWindowMs) {
    return {
      ...note,
      canHit: false,
      missed: true,
    };
  }

  return note;
}

function wasHoldReleased(hold: HoldNote, inputs: Input[]) {
  const released = inputs.find((input) => {
    return input.type === "up" && input.column === hold.at(0)!.column;
  });

  return Boolean(released);
}

/**
 * Returns a new chart and relevant data, given the existing state of the world.
 *
 * The only way the world changes is via a user input.
 * Given X world and Y input, the new world will always be Z.
 * That is to say the world in the engine is deterministic - no side effects.
 *
 * If there is no user input - that is, `inputs` is an empty array, the new chart will be identical to the previous one.
 */
export function updateGameState(
  world: World,
  config: EngineConfiguration
): UpdatedGameState {
  const prevFrameNotes = Array.from(world.chart.tapNotes.values());
  const prevFrameHoldNotes = Array.from(world.chart.holdNotes.values());

  const judgementResults = world.inputs.reduce<JudgementResult[]>(
    (acc, input) => {
      // we only judge inputs on key presses right now
      // maybe in the future we will have some judge-on-release mechanic (lift?)
      if (input.type === "up") {
        return acc;
      }

      const result = judgeInput({
        input,
        chart: { tapNotes: prevFrameNotes, holdNotes: prevFrameHoldNotes },
        maxWindow: config.maxHitWindow,
        timingWindows: config.timingWindows,
      });
      if (result) {
        return acc.concat(result);
      }
      return acc;
    },
    []
  );

  for (const result of judgementResults) {
    // TODO: have type: 'hold' | 'tap'?
    if (result.noteId.startsWith("h")) {
      world.activeHolds.add(result.noteId);
    }
  }

  const prevFrameMissedNotes = [
    ...prevFrameNotes,
    ...prevFrameHoldNotes.map((x) => x[0]),
  ].filter((x) => x.missed).length;

  let nextFrameMissedCount: number = 0;

  const newNotes = new Map<string, EngineNote>();
  for (const key of world.chart.tapNotes.keys()) {
    const newNote = processNoteJudgement(
      world.chart.tapNotes.get(key)!,
      judgementResults,
      world.time,
      config.maxHitWindow
    );

    if (newNote.missed) {
      nextFrameMissedCount++;
    }

    newNotes.set(key, newNote);
  }

  const newHoldNotes = new Map<string, EngineNote[]>();
  for (const key of world.chart.holdNotes.keys()) {
    const [holdNote, endNote] = world.chart.holdNotes.get(key)!;

    // If the end of the hold note is stale (eg, it is in the past)
    // and can never be hit) remove it from the active holds.
    if (world.time > endNote.ms) {
      world.activeHolds.delete(key);
    }

    const newHoldNote = processNoteJudgement(
      holdNote,
      judgementResults,
      world.time,
      config.maxHitWindow
    );

    if (newHoldNote.missed) {
      nextFrameMissedCount++;
    }

    newHoldNotes.set(key, [newHoldNote, endNote]);
  }

  let holdDropped = false;

  for (const key of world.activeHolds) {
    const hold = world.chart.holdNotes.get(key)!;
    if (wasHoldReleased(hold, world.inputs)) {
      holdDropped = true;
      world.activeHolds.delete(key);
    }
  }

  // if the number of missed notes changed, they must have
  // broke their combo.
  const comboBroken =
    nextFrameMissedCount > prevFrameMissedNotes || holdDropped;

  const combo = comboBroken ? 0 : world.combo + judgementResults.length;

  return {
    world: {
      ...world,
      combo,
      chart: {
        ...world.chart,
        tapNotes: newNotes,
        holdNotes: newHoldNotes,
      },
    },
    previousFrameMeta: {
      judgementResults,
      comboBroken,
    },
  };
}
