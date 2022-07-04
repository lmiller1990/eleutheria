import { playBeep } from "@packages/audio-utils";
import type {
  World,
  PreviousFrameMeta,
  GameConfig,
  GameLifecycle,
  Summary,
  EngineNote,
  JudgementResult,
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
import {
  engineConfiguration,
  MULTIPLIER,
  PADDING_MS,
  codeColumnMap,
  windows,
  timingWindows,
  GameplayModifiers,
} from "./gameConfig";
import { writeDebugToHtml } from "./debug";
import { LoadSongData } from "@packages/game-data";
import { getGameDataUrl } from "./env";

const noteMap = new Map<string, HTMLDivElement>();
const holdMap = new Map<string, HTMLDivElement>();

let timeoutId: number | undefined;

function drawNote(engineNote: EngineNote, elements: Elements): HTMLDivElement {
  const $note = $tapNote("gray-2 border-gray-5", engineNote.column);

  const colTarget = elements.targetColElements.get(engineNote.column);
  if (!colTarget) {
    throw Error(`Could not get colTarget for column ${engineNote.column}`);
  }
  colTarget.appendChild($note);

  return $note;
}

function drawHoldNote(
  holdNote: EngineNote[],
  elements: Elements
): HTMLDivElement {
  const $note = drawNote(holdNote.at(0)!, elements);
  $note.style.height = `${calcInitHeightOfHold(holdNote)}px`;
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

function calcInitHeightOfHold(hold: EngineNote[]): number {
  const firstNoteOfHold = hold.at(0)!;
  const lastNoteOfHold = hold.at(-1)!;
  return (lastNoteOfHold.ms - firstNoteOfHold.ms) * MULTIPLIER;
}

function calcHeightOfDroppedHold(hold: EngineNote[]): number {
  const firstNoteOfHold = hold.at(0)!;
  const lastNoteOfHold = hold.at(-1)!;
  if (!firstNoteOfHold.droppedAt) {
    throw Error("Cannot calc height of dropped hold that was not dropped!");
  }

  return (lastNoteOfHold.ms - firstNoteOfHold.droppedAt) * MULTIPLIER;
}

function updateHold(
  engineHold: EngineNote[],
  ypos: number,
  $note: HTMLDivElement,
  gameplayModifiers: GameplayModifiers
): HTMLDivElement {
  const hold = engineHold[0]!;

  const setPos = (px: string) => {
    $note.style[gameplayModifiers.scroll === "up" ? "top" : "bottom"] = px;
  };

  const initialHeight = calcInitHeightOfHold(engineHold);
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
    const adjustedHeight = calcHeightOfDroppedHold(engineHold);
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

function updateUI(
  state: World,
  previousFrameMeta: PreviousFrameMeta,
  elements: Elements
) {
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

type SongCompleted = (summary: Summary) => void;

function calcYPosition(note: EngineNote, world: World) {
  return (note.ms - world.time) * MULTIPLIER;
}

function getSongId(): { id: string; difficulty: string } {
  const url = new URL(window.location.toString());
  const params = new URLSearchParams(url.search);
  const id = params.get("song");
  const difficulty = params.get("difficulty");
  if (!id || !difficulty) {
    throw Error(
      `Expected ${window.location} to have search params ?song=<ID> and ?difficulty=<difficulty>`
    );
  }
  return { id, difficulty };
}

export async function fetchData(id: string): Promise<LoadSongData> {
  const res = await window.fetch(getGameDataUrl(`/songs/${id}`));
  return res.json();
}

export async function start(
  $root: HTMLDivElement,
  songCompleted: SongCompleted,
  gameplayModifiers: GameplayModifiers
) {
  const { id, difficulty } = getSongId();
  const data = await fetchData(id);
  const elements = createElements($root, 6, data.metadata);

  elements.targetLine.style[
    gameplayModifiers.scroll === "up" ? "top" : "bottom"
  ] = "100px";

  const chart = data.charts.find((x) => x.difficulty === difficulty);
  if (!chart) {
    throw Error(`Could not find chart with difficulty ${difficulty}`);
  }

  const gameConfig: GameConfig = {
    dev: {
      manualMode: false,
      // startAtMs: 125000,
    },
    songUrl: import.meta.env.VITE_SONG_DATA_URL,
    song: {
      tapNotes: chart.parsedTapNoteChart.tapNotes,
      holdNotes: chart.parsedHoldNoteChart.holdNotes,
      metadata: data.metadata,
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

  let beeped = new Map<string, boolean>();

  const lifecycle: GameLifecycle<GameplayModifiers> = {
    onUpdate: (world, previousFrameMeta, gameplayModifiers) => {
      // if (world.time > 4000) { return }
      for (const [id, engineNote] of world.chart.tapNotes) {
        const ypos = calcYPosition(engineNote, world);
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
          updateNote($note, ypos, gameplayModifiers.scroll);
        }

        // See if the note has scrolled outside the viewport and remove if necessary
        // Another perf. optimization.
        if ($note && shouldRemoveNote($note, gameplayModifiers.scroll)) {
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
        const ypos = calcYPosition(engineNote, world);
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
          $note = drawHoldNote(hold, elements);
          holdMap.set(id, $note);
        }

        // We need to update the position, since the note has been drawn
        // and it is in the viewport
        if ($note && inViewport) {
          updateHold(hold, ypos, $note, gameplayModifiers);
        }

        // if the tail end of the hold is above the top of the viewport
        // remove it!
        if ($note && shouldRemoveNote($note, gameplayModifiers.scroll)) {
          $note.remove();
        }
      }

      updateUI(world, previousFrameMeta, elements);
    },

    onJudgement: (world: World, _judgementResults: JudgementResult[]) => {
      const summary = summarizeResults(world, timingWindows);

      for (const win of [...windows, "miss"] as const) {
        // elements.scoreTable[win].textContent =
        //   summary.timing[win].count.toString();
      }

      // elements.scoreTable.percent.textContent = `${summary.percent}%`;
    },

    onDebug: (world: World, fps: number) => {
      writeDebugToHtml(world, fps, elements);
    },

    onSongCompleted: (_world: World) => {
      noteMap.clear();
      holdMap.clear();
      timeoutId = undefined;

      const summary = summarizeResults(
        _world,
        engineConfiguration.timingWindows ?? []
      );

      window.clearTimeout(timeoutId);
      songCompleted(summary);
    },

    onStart: (_world: World) => {
      // ...
    },
  };

  const game = new Game(gameConfig, lifecycle, gameplayModifiers);

  // let i = 0;
  // window.manualTick = () => {
  //   game.setTestOnlyDeltaTime((i += 100));
  // };

  await game.start(id, data.metadata);
}
