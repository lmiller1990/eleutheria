import type {
  World,
  PreviousFrameMeta,
  GameConfig,
  GameLifecycle,
  Summary,
  EngineNote,
} from "@packages/engine";
import { summarizeResults, Game } from "@packages/engine";
import { fetchData } from "./fetchData";
import {
  $tapNote,
  createElements,
  targetFlash,
  targetNoteHitFlash,
  judgementFlash,
  Elements,
  $holdNote,
} from "./elements";
import {
  engineConfiguration,
  MULTIPLIER,
  PADDING_MS,
  codeColumnMap,
} from "./config";
import { writeDebugToHtml } from "./debug";

const noteMap = new Map<string, HTMLDivElement>();
const holdMap = new Map<string, HTMLDivElement>();

let timeoutId: number | undefined;

function drawNote(engineNote: EngineNote, elements: Elements): HTMLDivElement {
  const $note = $tapNote();

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

function shouldRemoveNote($note: HTMLDivElement) {
  const { y, height } = $note.getBoundingClientRect();

  // TODO: Support reverse/sideways scrolling?
  const isAboveViewport = y + height < 0;

  return isAboveViewport;
}

function calcInitHeightOfHold(hold: EngineNote[]): number {
  const firstNoteOfHold = hold.at(0)!;
  const lastNoteOfHold = hold.at(-1)!;
  return (lastNoteOfHold.ms - firstNoteOfHold.ms) * MULTIPLIER;
}

function getHoldState(engineHold: EngineNote[]): "stale" | "held" | undefined {
  const engineNote = engineHold.at(0)!;

  if (engineNote.missed) {
    return "stale";
  }

  if (engineNote.isHeld) {
    return "held";
  }

  return;
}

function updateHold(
  engineHold: EngineNote[],
  ypos: number,
  $note: HTMLDivElement
): HTMLDivElement {
  $note.style.top = `${ypos}px`;

  const state = getHoldState(engineHold);
  if (state) {
    console.log("state", state);
  }

  if (state === "held") {
    $note.style.filter = "brightness(2.0)";
    return $note;
  }

  if (state === "stale") {
    $note.style.opacity = "0.25";
    return $note;
  }

  return $note;
  // const initialHeight = calcInitHeightOfHold(engineHold);

  // // initial height. This is height before it has crossed the targets
  // // so it's theoretical "maximum" height
  // const height = calcInitHeightOfHold(engineHold);
  // $note.style.height = `${height}px`;

  // const newHeight = initialHeight + ypos;

  // const holdWasHit = engineHold.at(0)!.hitAt;

  // if ((ypos < 0 && newHeight > 0) || holdWasHit) {
  //   $note.style.height = `${newHeight}px`;
  //   $note.style.top = `0px`;
  // } else {
  // }
}

function updateNote($note: HTMLDivElement, ypos: number) {
  $note.style.top = `${ypos}px`;
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

      state.inputManager.consume(judgement.inputs);

      const timing = `(${(judgement.timing * -1).toFixed()})`;
      const text =
        note.timingWindowName === "perfect"
          ? note.timingWindowName
          : judgement.timing > 0
          ? `${note.timingWindowName}`
          : `${note.timingWindowName}`;

      judgementFlash(
        elements.timing,
        note.timingWindowName,
        `${text} ${timing}`
      );
      targetNoteHitFlash(elements.targetColElements, note.column);

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

export async function start(
  $root: HTMLDivElement,
  songCompleted: SongCompleted
) {
  const elements = createElements($root, 6);
  const data = await fetchData();

  const gameConfig: GameConfig = {
    song: {
      tapNotes: data.tapNotes.tapNotes,
      holdNotes: data.holdNotes.holdNotes,
      metadata: data.metadata,
    },
    preSongPadding: PADDING_MS,
    postSongPadding: PADDING_MS,
    engineConfiguration,
    codeColumns: codeColumnMap,
    inputManagerConfig: {
      onKeyCallback: new Map([
        ["KeyS", () => targetFlash(elements.targetColElements, 0)],
        ["KeyD", () => targetFlash(elements.targetColElements, 1)],
        ["KeyF", () => targetFlash(elements.targetColElements, 2)],
        ["KeyJ", () => targetFlash(elements.targetColElements, 3)],
        ["KeyK", () => targetFlash(elements.targetColElements, 4)],
        ["KeyL", () => targetFlash(elements.targetColElements, 5)],
      ]),
    },
  };

  const lifecycle: GameLifecycle = {
    onUpdate: (world: World, previousFrameMeta: PreviousFrameMeta) => {
      // if (world.time > 4000) { return }
      for (const [id, engineNote] of world.chart.tapNotes) {
        const ypos = calcYPosition(engineNote, world);
        let $note = noteMap.get(id);

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
          updateNote($note, ypos);
        }

        // See if the note has scrolled outside the viewport and remove if necessary
        // Another perf. optimization.
        if ($note && shouldRemoveNote($note)) {
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
          updateHold(hold, ypos, $note);
        }

        // if the tail end of the hold is above the top of the viewport
        // remove it!
        if ($note && shouldRemoveNote($note)) {
          $note.remove();
        }
      }

      // for (const [id, hold] of world.chart.holdNotes) {
      //   const firstNoteOfHold = hold[0];
      //   const ypos = (firstNoteOfHold.ms - world.time) * MULTIPLIER;
      //   const $note = holdMap.get(firstNoteOfHold.id);

      //   if (!$note) {
      //     throw Error(`Tried to access note ${id} but wasn't in noteMap!`);
      //   }
      //   if (!firstNoteOfHold.id.startsWith("h")) {
      //     $note.remove();
      //   }

      //   // if (hold.at(0)!.hitAt !== undefined) {
      //   //   console.log(hold);
      //   // }

      //   updateHold(hold, ypos, $note);

      //   if (ypos < window.innerHeight) {
      //     const height = calcInitHeightOfHold(hold);
      //     const $createHoldNote = () => {
      //       const $hold = $holdNote();
      //       $hold.style.height = `${height}px`;
      //       return $hold;
      //     };

      //     appendNote(firstNoteOfHold, ypos, elements, holdMap, $createHoldNote);
      //   }
      // }

      updateUI(world, previousFrameMeta, elements);
    },

    onDebug: (_world: World, fps: number) => {
      writeDebugToHtml(fps, elements);
    },

    onSongCompleted: (_world: World) => {
      noteMap.clear();
      timeoutId = undefined;

      const summary = summarizeResults(
        _world,
        engineConfiguration.timingWindows?.map((x) => x.name) || []
      );

      window.clearTimeout(timeoutId);
      songCompleted(summary);
    },
  };

  const game = new Game(gameConfig, lifecycle);

  await game.start();
}
