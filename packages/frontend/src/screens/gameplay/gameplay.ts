import { playBeep } from "@packages/audio-utils";
import {
  World,
  PreviousFrameMeta,
  GameConfig,
  GameLifecycle,
  Summary,
  EngineNote,
  JudgementResult,
  AudioProvider,
} from "@packages/engine";
import { summarizeResults, Game } from "@packages/engine";
import {
  $tapNote,
  createElements,
  targetFlash,
  targetNoteHitFlash,
  judgementFlash,
  Elements,
} from "./elements";
import { engineConfiguration, PADDING_MS, codeColumnMap } from "./gameConfig";
import { writeDebugToHtml } from "./debug";
import { ModifierManager } from "./modiferManager";
import {
  NoteSkin,
  ParamData,
  timingWindows,
  UserScripts,
} from "@packages/types";
import { preferencesManager } from "./preferences";
import { ParsedTapNoteChart } from "@packages/chart-parser";

let timeoutId: number | undefined;

function drawNote(engineNote: EngineNote, elements: Elements): HTMLDivElement {
  const $note = $tapNote(
    "gray-2",
    engineNote.column,
    engineNote.measureNumber.toString()
  );

  const colTarget = elements.targetColElements.get(engineNote.column);
  if (!colTarget) {
    throw Error(`Could not get colTarget for column ${engineNote.column}`);
  }
  colTarget.appendChild($note);

  return $note;
}

function drawHoldNote(
  holdNote: EngineNote[],
  elements: Elements,
  modifierManager: ModifierManager
): HTMLDivElement {
  const $note = drawNote(holdNote.at(0)!, elements);
  $note.style.height = `${calcInitHeightOfHold(holdNote, modifierManager)}px`;
  return $note;
}

// function shouldRemoveHold($note: HTMLDivElement) {
//   const rect = $note.getBoundingClientRect()
//   if (rect.height === 0) {
//     $note.remove()
//   }
// }

function shouldRemoveNote($note: HTMLDivElement, scroll: "up" | "down") {
  const { y, height } = $note.getBoundingClientRect();

  if (scroll === "up") {
    // above viewport - remove
    return y + height < 0;
  } else {
    // below viewport - remove
    return y - height > window.innerHeight;
  }
}

function calcInitHeightOfHold(
  hold: EngineNote[],
  modifierManager: ModifierManager
): number {
  const firstNoteOfHold = hold.at(0)!;
  const lastNoteOfHold = hold.at(-1)!;
  return (lastNoteOfHold.ms - firstNoteOfHold.ms) * modifierManager.multiplier;
}

function calcHeightOfDroppedHold(
  hold: EngineNote[],
  modifierManager: ModifierManager
): number {
  const firstNoteOfHold = hold.at(0)!;
  const lastNoteOfHold = hold.at(-1)!;
  if (!firstNoteOfHold.droppedAt) {
    throw Error("Cannot calc height of dropped hold that was not dropped!");
  }

  return (
    (lastNoteOfHold.ms - firstNoteOfHold.droppedAt) * modifierManager.multiplier
  );
}

function updateHold(
  engineHold: EngineNote[],
  ypos: number,
  $note: HTMLDivElement,
  modifierManager: ModifierManager
): HTMLDivElement {
  const hold = engineHold[0]!;

  const setPos = (px: string) => {
    $note.style[modifierManager.scrollDirection === "up" ? "top" : "bottom"] =
      px;
  };

  const initialHeight = calcInitHeightOfHold(engineHold, modifierManager);

  const newHeight = initialHeight + ypos;

  if (hold.isHeld) {
    $note.style.filter = "brightness(2.0)";
    setPos(`0px`);

    if (newHeight < 0) {
      $note.style.display = "none";
    } else {
      $note.style.height = `${newHeight}px`;
    }

    return $note;
  }

  if (hold.droppedAt) {
    const adjustedHeight = calcHeightOfDroppedHold(engineHold, modifierManager);
    const diff = initialHeight - adjustedHeight;
    $note.style.opacity = "0.25";
    setPos(`${ypos + diff}px`);
    return $note;
  }

  if (hold.missed) {
    setPos(`${ypos}px`);
    $note.style.opacity = "0.25";
    return $note;
  }

  setPos(`${ypos}px`);

  return $note;
}

function updateNote(
  $note: HTMLDivElement,
  ypos: number,
  scroll: "up" | "down"
) {
  if (scroll === "up") {
    $note.style.top = `${ypos}px`;
  } else {
    $note.style.bottom = `${ypos}px`;
  }
}

function redrawTargets(elements: Elements, modifierManager: ModifierManager) {
  if (modifierManager.scrollDirection === "up") {
    elements.targetLine.style.top = "100px";
    elements.targetLine.style.bottom = "";
  }

  if (modifierManager.scrollDirection === "down") {
    elements.targetLine.style.top = "";
    elements.targetLine.style.bottom = "100px";
  }
}

function updateUI(
  state: World,
  previousFrameMeta: PreviousFrameMeta,
  modifierManager: ModifierManager,
  elements: Elements
) {
  // if the scrollDirection has changed, we need to redraw the targets.
  redrawTargets(elements, modifierManager);

  if (previousFrameMeta.judgementResults.length) {
    // some notes were judged on the previous window
    for (const judgement of previousFrameMeta.judgementResults) {
      const note =
        state.chart.tapNotes.get(judgement.noteId) ||
        state.chart.holdNotes.get(judgement.noteId)?.at(0);

      if (!note || !note.timingWindowName) {
        throw Error(
          `Could not find judged note with id ${judgement.noteId} and timing window ${note?.timingWindowName}. This should never happen.`
        );
      }

      judgementFlash(elements.timing, note.timingWindowName, judgement.timing);

      if (judgement.timingWindowName !== "miss") {
        targetNoteHitFlash(elements.targetColElements, note.column);
      }

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        elements.timing.innerText = "";
      }, 2000);
    }
  }

  elements.combo.innerText = state.combo > 0 ? `${state.combo} combo` : ``;
}

function calcYPosition(
  note: EngineNote,
  world: World,
  modifierManager: ModifierManager
) {
  return (note.ms - world.time) * modifierManager.multiplier;
}

export interface StartGameArgs {
  songData: {
    chart: {
      parsedTapNoteChart: ParsedTapNoteChart;
      offset: number;
    };
  };
  noteSkinData: NoteSkin[];
  paramData: ParamData;
  userData: UserScripts;
  modifierManager?: ModifierManager;
  audioProvider?: AudioProvider;
  songCompleted: (world: World) => void;
  updateSummary: (summary: Summary) => void;
}

export interface StartGame {
  game: Game | undefined;
  start: () => Promise<void> | undefined;
  stop: () => void;
}

export function create(
  $root: HTMLDivElement,
  startGameArgs: StartGameArgs,
  __testingDoNotStartSong = false,
  __testingManualMode = false,
  __startAtMs: number = 0
): StartGame | void {
  const { songData, paramData, songCompleted, updateSummary } = startGameArgs;

  const elements = createElements($root, 6);

  const modifierManager =
    startGameArgs.modifierManager ?? new ModifierManager();
  // modifierManager.setMultipler(0.25);
  modifierManager.setMultipler(1);
  modifierManager.setCover({ visible: false });

  elements.cover.style.display = modifierManager.cover.visible
    ? "block"
    : "none";

  const offset = window.innerHeight - modifierManager.cover.offset;
  elements.cover.style[modifierManager.cover.location] = `${offset}px`;

  modifierManager.on("set:scrollDirection", (val) => {
    if (val === "up") {
      elements.timing.style.top = "400px";
      elements.combo.style.top = "450px";
      elements.timing.style.bottom = "unset";
      elements.combo.style.bottom = "unset";
    }

    if (val === "down") {
      elements.timing.style.bottom = "450px";
      elements.combo.style.bottom = "400px";
      elements.timing.style.top = "unset";
      elements.combo.style.top = "unset";
    }
  });

  modifierManager.on("set:cover", (val) => {
    elements.cover.style.display = val.visible ? "block" : "none";

    if (!val.visible) {
      return;
    }

    // need to update these manually, since these modifiers
    // are not added via the ModifierPanel UI.
    modifierManager.setOffset(val.offset);
    preferencesManager.updatePreferences({ cover: val });

    let position: string | undefined;

    if (val.location === "top") {
      position = `calc(-100vh + ${val.offset}px)`;
    }

    if (val.location === "bottom") {
      position = `calc(-100vh + ${val.offset}px)`;
    }

    if (!position) {
      throw Error(`Expected position to be assigned`);
    }

    elements.cover.setAttribute("style", val.style);
    elements.cover.style[val.location] = position;
  });

  if (__testingDoNotStartSong) {
    return;
  }

  console.log('song data', songData)
  const gameConfig: GameConfig = {
    dev: {
      manualMode: __testingManualMode,
      startAtMs: __startAtMs,
    },
    chart: {
      tapNotes: songData.chart.parsedTapNoteChart.tapNotes,
      holdNotes: [], // songData.chart.parsedTapNoteChart.holdNotes,
      offset: songData.chart.offset,
    },
    preSongPadding: PADDING_MS,
    postSongPadding: PADDING_MS,
    engineConfiguration,
    codeColumns: codeColumnMap,
    inputManagerConfig: {
      onKeyDownCallback: new Map([
        ["KeyS", () => targetFlash(elements.targetColElements, 0)],
        ["KeyD", () => targetFlash(elements.targetColElements, 1)],
        ["KeyF", () => targetFlash(elements.targetColElements, 2)],
        ["KeyJ", () => targetFlash(elements.targetColElements, 3)],
        ["KeyK", () => targetFlash(elements.targetColElements, 4)],
        ["KeyL", () => targetFlash(elements.targetColElements, 5)],
      ]),
    },
  };

  const noteMap = new Map<string, HTMLDivElement>();
  const holdMap = new Map<string, HTMLDivElement>();
  let beeped = new Map<string, boolean>();

  const teardown = () => {
    noteMap.forEach((note) => note.remove());
    holdMap.forEach((note) => note.remove());
    noteMap.clear();
    holdMap.clear();
    timeoutId = undefined;
    // $root.innerHTML = "";
  };

  const lifecycle: GameLifecycle = {
    onUpdate: (world, previousFrameMeta, modifierManager) => {
      // if (world.time > 4000) { return }
      for (const [id, engineNote] of world.chart.tapNotes) {
        const ypos = calcYPosition(engineNote, world, modifierManager);
        let $note = noteMap.get(id);

        if (ypos < 0 && !beeped.has(id)) {
          beeped.set(id, true);
          playBeep();
        }

        const inViewport = ypos < window.innerHeight;
        // If:
        // - the DOM element does not exist
        // - it has not already been hit
        // - it is in the viewport
        // we need to draw it - it's the first time we've encountered this note.
        if (!$note && !engineNote.hitTiming && inViewport) {
          $note = drawNote(engineNote, elements);
          noteMap.set(id, $note);
        }

        // We need to update the position, since the note has been drawn
        // and it is in the viewport
        if ($note && inViewport) {
          updateNote($note, ypos, modifierManager.scrollDirection);
        }

        // See if the note has scrolled outside the viewport and remove if necessary
        // Another perf. optimization.
        if ($note && shouldRemoveNote($note, modifierManager.scrollDirection)) {
          $note.remove();
        }

        // If not the has been hit, we should remove it from the DOM
        // for performance reasons.
        if (engineNote.hitTiming) {
          if (!$note) {
            throw Error(`Tried to access note ${id} but wasn't in noteMap!`);
          }
          // We still keep a refererence to the DOM node in `noteMap`
          // We just want to remove it from the DOM for optimization purposes.
          // TODO: better memory footprint - don't even keep a reference around
          // This will be a memory leak.
          $note.remove();
        }
      }

      // handle hold notes!
      for (const [id, hold] of world.chart.holdNotes) {
        const engineNote = hold[0];
        const ypos = calcYPosition(engineNote, world, modifierManager);
        let $note = holdMap.get(engineNote.id);

        const inViewport = ypos < window.innerHeight;

        if (ypos < 0 && !beeped.has(id)) {
          beeped.set(id, true);
          playBeep();
        }

        // If:
        // - the DOM element does not exist
        // - it has not already been hit
        // - it is in the viewport
        // we need to draw it - it's the first time we've encountered this note.

        if (!$note && !engineNote.hitTiming && inViewport) {
          $note = drawHoldNote(hold, elements, modifierManager);
          holdMap.set(id, $note);
        }

        // We need to update the position, since the note has been drawn
        // and it is in the viewport
        if ($note && inViewport) {
          updateHold(hold, ypos, $note, modifierManager);
        }

        // if the tail end of the hold is above the top of the viewport
        // remove it!
        if ($note && shouldRemoveNote($note, modifierManager.scrollDirection)) {
          $note.remove();
        }
      }

      updateUI(world, previousFrameMeta, modifierManager, elements);
    },

    onJudgement: (world: World, _judgementResults: JudgementResult[]) => {
      const summary = summarizeResults(
        {
          tapNotes: [...world.chart.tapNotes.values()],
          holdNotes: [...world.chart.holdNotes.values()],
        },
        timingWindows
      );

      updateSummary(summary);
    },

    onDebug: (world: World, fps: number) => {
      writeDebugToHtml(world, fps, elements);
    },

    onSongCompleted: (world: World) => {
      teardown();
      window.clearTimeout(timeoutId);
      songCompleted(world);
    },

    onStart: (_world: World) => {
      // ...
    },
  };

  if (__testingManualMode) {
    window.manualTick = (ms: number) => {
      game.setTestOnlyDeltaTime(ms);
    };
  }

  const game = new Game(
    gameConfig,
    lifecycle,
    startGameArgs.audioProvider,
    modifierManager
  );

  return {
    game,
    start: () => {
      redrawTargets(elements, modifierManager);
      return game.start(paramData.songId);
    },
    stop: () => {
      teardown();
      game.stop();
    },
  };
}
