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
  $note,
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
} from "./config";
import { writeDebugToHtml } from "./debug";

const noteMap = new Map<string, HTMLDivElement>();

let timeoutId: number | undefined;

function appendNote(
  engineNote: EngineNote,
  ypos: number,
  elements: Elements 
) {
  const $n = $note();
  noteMap.set(engineNote.id, $n);

  updateNote($n, ypos);

  const colTarget = elements.targetColElements.get(engineNote.column)
  if (!colTarget) {
    throw Error(`Could not get colTarget for column ${engineNote.column}`)
  }
  colTarget.appendChild($n);
}

function updateNote($n: HTMLDivElement, ypos: number) {
  $n.style.top = `${ypos}px`;
  if ($n.getBoundingClientRect().y < 0) {
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
      const note = state.chart.notes.get(judgement.noteId);
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
      targetNoteHitFlash(
        elements.targetColElements,
        note.column
      );

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
      notes: data.notes,
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
      for (const [id, n] of world.chart.notes) {
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
            appendNote(n, ypos, elements);
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
