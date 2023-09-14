import { playBeep } from "@packages/audio-utils";
import {
  World,
  PreviousFrameMeta,
  GameConfig,
  GameLifecycle,
  EngineNote,
  JudgementResult,
} from "@packages/engine";
import { Game } from "@packages/engine";
import { AudioData, summarizeResults, Summary } from "@packages/shared";
import {
  $tapNote,
  createElements,
  targetFlash,
  targetNoteHitFlash,
  judgementFlash,
  Elements,
} from "./elements";
import {
  engineConfiguration,
  PADDING_MS,
  codeColumnMap,
  SPEED_MOD_NORM_FACTOR,
} from "./gameConfig";
import { writeDebugToHtml } from "./debug";
import { ModifierManager } from "./modiferManager";
import { timingWindows } from "@packages/shared";
import { ParsedTapNoteChart } from "@packages/chart-parser";
import { ScrollDirection } from "./types";
import {
  injectNoteSkin,
  injectStylesheet,
  removeAllInjectedStylesheets,
  stylesheetInjectionKeys,
} from "../../plugins/injectGlobalCssVars";

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
  return (
    ((lastNoteOfHold.ms - firstNoteOfHold.ms) * modifierManager.multiplier) /
    SPEED_MOD_NORM_FACTOR
  );
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
    ((lastNoteOfHold.ms - firstNoteOfHold.droppedAt) *
      modifierManager.multiplier) /
    SPEED_MOD_NORM_FACTOR
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

function getCssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function redrawTargets(scrollDirection: ScrollDirection) {
  const noteHeight = getCssVar("--note-height");
  const offset = `calc(${noteHeight} * 2)`;

  if (scrollDirection === "up") {
    const style = `#target-line { top: ${offset}; }`;
    injectStylesheet(style, stylesheetInjectionKeys.targetLine);
  }

  if (scrollDirection === "down") {
    const style = `#target-line { bottom: ${offset}; }`;
    injectStylesheet(style, stylesheetInjectionKeys.targetLine);
  }
}

function updateUI(
  state: World,
  previousFrameMeta: PreviousFrameMeta,
  elements: Elements
) {
  if (previousFrameMeta.judgementResults.length) {
    // some notes were judged on the previous window
    for (const judgement of previousFrameMeta.judgementResults) {
      const note =
        state.chart.tapNotes.get(judgement.note.id) ||
        state.chart.holdNotes.get(judgement.note.id)?.at(0);

      if (!note || !note.timingWindowName) {
        throw Error(
          `Could not find judged note with id ${judgement.note.id} and timing window ${note?.timingWindowName}. This should never happen.`
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
  return (
    (((note.ms - world.time) * modifierManager.multiplier) /
      SPEED_MOD_NORM_FACTOR) *
    (window.innerHeight / 1000)
  );
}

/** TODO: Ensure this cannot be used maliciously. We need to either hand curate or sandbox this. */
function dangerouslyExecuteArbitraryCode(code: string) {
  const fn = new Function(code);
  fn.call(undefined);
}

function cullOutOfBoundsNotes(
  targetsRect: DOMRect,
  notes: Map<string, HTMLDivElement>
) {
  for (const note of notes.values()) {
    const noteRect = note.getBoundingClientRect();

    if (
      noteRect.top > targetsRect.top &&
      noteRect.bottom < targetsRect.bottom
    ) {
      note.classList.remove("opacity-0");
    } else {
      note.classList.add("opacity-0");
    }
  }
}

export interface StartGameArgs {
  noteCulling?: boolean;
  songData: {
    chart: {
      parsedTapNoteChart: ParsedTapNoteChart;
      offset: number;
    };
  };
  modifierManager?: ModifierManager;
  songCompleted: (world: World) => void;
  updateSummary: (summary: Summary) => void;
}

export interface StartGame {
  game: Game | undefined;
  start: (audioData: AudioData) => Promise<void> | undefined;
  stop: () => void;
}

export function create(
  $root: HTMLDivElement,
  startGameArgs: StartGameArgs,
  __testingDoNotStartSong = false,
  __testingManualMode = false,
  __startAtMs: number = 0
): StartGame | void {
  const { songData, songCompleted, updateSummary, noteCulling } = startGameArgs;

  const elements = createElements($root, 6);

  const modifierManager =
    startGameArgs.modifierManager ?? new ModifierManager();

  const targetsRect = elements.targets.getBoundingClientRect();

  if (modifierManager.scrollDirection === "up") {
    elements.timing.style.top = "300px";
    elements.combo.style.top = "350px";
  } else {
    elements.timing.style.bottom = "350px";
    elements.combo.style.bottom = "400px";
  }

  modifierManager.on("set:scrollDirection", (direction) => {
    // if the scrollDirection has changed, we need to redraw the targets.
    redrawTargets(direction);
  });

  modifierManager.on("set:cover", (newCover) => {
    if (modifierManager.scrollDirection === "up") {
      elements.cover.style.top = `${100 - newCover.offset}%`;
    }

    if (modifierManager.scrollDirection === "down") {
      elements.cover.style.bottom = `${100 - newCover.offset}%`;
      elements.cover.style.height = `${
        elements.cover.getBoundingClientRect().bottom -
        elements.targets.getBoundingClientRect().top
      }px`;
    }

    elements.cover.innerHTML = ``;
    try {
      dangerouslyExecuteArbitraryCode(newCover.code);
    } catch (e) {
      // no-op - assume userland code can and will error, should not break gameplay.
    }
    injectStylesheet(newCover.css, stylesheetInjectionKeys.coverCss);
  });

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

  if (__testingDoNotStartSong) {
    return;
  }

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
    noteCulling,
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
  };

  let prevGameStartTime: number | undefined;

  const lifecycle: GameLifecycle = {
    onUpdate: (world, previousFrameMeta, modifierManager, gameStartTime) => {
      if (prevGameStartTime !== gameStartTime) {
        beeped.clear();
        prevGameStartTime = gameStartTime;
      }

      if (noteCulling) {
        cullOutOfBoundsNotes(targetsRect, noteMap);
      }

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

      updateUI(world, previousFrameMeta, elements);
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
      // trigger render of UI
      modifierManager.emit(
        "set:cover",
        modifierManager.cover,
        modifierManager.cover
      );
      injectNoteSkin(modifierManager.noteSkin);
    },
  };

  if (__testingManualMode) {
    window.manualTick = (ms: number) => {
      game.setTestOnlyDeltaTime(ms);
    };
  }

  const game = new Game(gameConfig, lifecycle, modifierManager);

  return {
    game,
    start: (audioData: AudioData) => {
      redrawTargets(modifierManager.scrollDirection);
      return game.start(audioData);
    },
    stop: () => {
      teardown();
      removeAllInjectedStylesheets();
      game.stop();
    },
  };
}
