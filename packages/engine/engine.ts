import { InputManager } from "./inputManager";

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
  notes: EngineNote[];
}

export interface EngineConfiguration {
  maxHitWindow: number;
  timingWindows?: TimingWindow[];
}

interface CreateChart {
  offset: number;
  notes: EngineNote[];
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
    notes: args.notes.map((note) => {
      return {
        ...note,
        ms: note.ms + args.offset,
      };
    }),
  };
}

/**
 * Finds the "nearest" note given an input and a chart for scoring.
 */
export function nearestNote(
  input: Input,
  chart: Chart
): EngineNote | undefined {
  const nearest = chart.notes.reduce((best, note) => {
    if (
      input.column === note.column &&
      Math.abs(note.ms - input.ms) <= Math.abs(best.ms - input.ms)
    ) {
      return note;
    }
    return best;
  }, chart.notes[0]);

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
  notes: Map<string, EngineNote>;
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
  const note = nearestNote(input, chart);

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
  const notes = new Map<string, EngineNote>();

  chart.notes.forEach((note) => {
    notes.set(note.id, {
      ...note,
      timingWindowName: undefined,
      canHit: true,
    });
  });

  return {
    notes,
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
      missed: true,
    };
  }

  return note;
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
  const prevFrameNotes = Array.from(world.chart.notes.values());

  const judgementResults = world.inputs.reduce<JudgementResult[]>(
    (acc, input) => {
      const result = judgeInput({
        input,
        chart: { notes: prevFrameNotes },
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

  const prevFrameMissedNotes = prevFrameNotes.filter((x) => x.missed).length;
  let nextFrameMissedCount: number = 0;

  const newNotes = new Map<string, EngineNote>();
  for (const key of world.chart.notes.keys()) {
    const newNote = processNoteJudgement(
      world.chart.notes.get(key)!,
      judgementResults,
      world.time,
      config.maxHitWindow
    );

    if (newNote.missed) {
      nextFrameMissedCount++;
    }

    newNotes.set(key, newNote);
  }

  // if the number of missed notes changed, they must have
  // broke their combo.
  const comboBroken = nextFrameMissedCount > prevFrameMissedNotes;
  const combo = comboBroken ? 0 : world.combo + judgementResults.length;

  return {
    world: {
      ...world,
      combo,
      chart: {
        ...world.chart,
        notes: newNotes,
      },
    },
    previousFrameMeta: {
      judgementResults,
      comboBroken,
    },
  };
}
