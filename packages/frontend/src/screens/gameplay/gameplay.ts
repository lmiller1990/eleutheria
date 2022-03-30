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

function appendNote(
  engineNote: EngineNote,
  ypos: number,
  elements: Elements,
  map: Map<string, HTMLDivElement>,
  $noteFactory: () => HTMLDivElement
) {
  const $n = $noteFactory();
  map.set(engineNote.id, $n);

  updateNote($n, ypos);

  const colTarget = elements.targetColElements.get(engineNote.column);
  if (!colTarget) {
    throw Error(`Could not get colTarget for column ${engineNote.column}`);
  }
  colTarget.appendChild($n);
}

function calcInitHeightOfHold(hold: EngineNote[]): number {
  const firstNoteOfHold = hold.at(0)!;
  const lastNoteOfHold = hold.at(-1)!;
  return (lastNoteOfHold.ms - firstNoteOfHold.ms) * MULTIPLIER;
}

function updateHold(hold: EngineNote[], ypos: number, $note: HTMLDivElement) {
  const initialHeight = calcInitHeightOfHold(hold);

  const newHeight = initialHeight + ypos;
  if (ypos < 0 && newHeight > 0) {
    console.log({ initialHeight, ypos, newHeight });
    $note.style.height = `${newHeight}px`;
    $note.style.top = `-2px`;
  } else {
    $note.style.top = `${ypos}px`;
  }

  const { y, height } = $note.getBoundingClientRect();

  if (y + height < 0) {
    $note.remove();
  }
}

function updateNote($n: HTMLDivElement, ypos: number) {
  $n.style.top = `${ypos}px`;
  const { y, height } = $n.getBoundingClientRect();
  if (y + height < 0) {
    $n.remove();
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
      console.log(judgement, note, state.chart);
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
      for (const [id, n] of world.chart.tapNotes) {
        const ypos = (n.ms - world.time) * MULTIPLIER;
        const $note = noteMap.get(id);

        if (n.hitTiming) {
          if (!$note) {
            throw Error(`Tried to access note ${id} but wasn't in noteMap!`);
          }
          $note.remove();
        } else {
          if ($note) {
            updateNote($note, ypos);
          } else if (ypos < window.innerHeight) {
            appendNote(n, ypos, elements, noteMap, $tapNote);
          }
        }
      }

      for (const [id, hold] of world.chart.holdNotes) {
        const firstNoteOfHold = hold[0];
        const ypos = (firstNoteOfHold.ms - world.time) * MULTIPLIER;
        const $note = holdMap.get(firstNoteOfHold.id);

        if (firstNoteOfHold.hitTiming) {
          if (!$note) {
            throw Error(`Tried to access note ${id} but wasn't in noteMap!`);
          }
          $note.remove();
        } else {
          if ($note) {
            updateHold(hold, ypos, $note);
          } else if (ypos < window.innerHeight) {
            const height = calcInitHeightOfHold(hold);
            const $createHoldNote = () => {
              const $hold = $holdNote();
              $hold.style.height = `${height}px`;
              return $hold;
            };

            appendNote(
              firstNoteOfHold,
              ypos,
              elements,
              holdMap,
              $createHoldNote
            );
          }
        }
      }

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
