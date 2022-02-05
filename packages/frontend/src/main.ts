import {
  createChart,
  initGameState,
  updateGameState,
  World,
  InputManager,
  PreviousFrameMeta,
  Game,
  GameConfig,
  GameLifecycle,
} from "@packages/engine";
import { fetchAudio, fetchData } from "./fetchData";
import {
  $note,
  $targetLine,
  $timing,
  $start,
  $stop,
  targetFlash,
  targetNoteHitFlash,
  judgementFlash,
  $combo,
} from "./elements";
import {
  engineConfiguration,
  NOTE_WIDTH,
  MULTIPLIER,
  PADDING_MS,
  codeColumnMap,
} from "./config";
import { writeDebugToHtml } from "./debug";

const noteMap = new Map<string, HTMLDivElement>();

let timeoutId: number;
let cancel: boolean = false;
let lastDebugUpdate = 0;
let ticks = 0;

function appendNote(id: string, xpos: number, ypos: number) {
  const $n = $note();
  noteMap.set(id, $n);

  updateNote($n, xpos, ypos);

  $targetLine.appendChild($n);
}

function updateNote($n: HTMLDivElement, xpos: number, ypos: number) {
  $n.style.top = `${ypos}px`;
  $n.style.left = `${xpos}px`;
  if ($n.getBoundingClientRect().y < 0) {
    $n.remove();
  }
}

function updateUI(state: World, previousFrameMeta: PreviousFrameMeta) {
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

      const timing = `(${(judgement.timing * -1).toFixed()})`
      const text =
        note.timingWindowName === "perfect"
          ? note.timingWindowName
          : judgement.timing > 0
          ? `${note.timingWindowName}`
          : `${note.timingWindowName}`;

      judgementFlash(note.timingWindowName, `${text} ${timing}`);
      targetNoteHitFlash(note.columns[0] as 0 | 1 | 2 | 3);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        $timing.innerText = "";
      }, 2000);
    }
  }

  $combo.innerText = state.combo > 0 ? `${state.combo} combo` : ``;
}

// function gameLoop(gameState: World) {
//   ticks += 1;
//   if (cancel) {
//     return;
//   }

//   const dt =
//     gameState.audioContext.getOutputTimestamp().performanceTime! - gameState.t0;

//   const world: World = {
//     t0: gameState.t0,
//     source: gameState.source,
//     inputManager: gameState.inputManager,
//     audioContext: gameState.audioContext,
//     startTime: gameState.t0,
//     combo: gameState.combo,
//     inputs: gameState.inputManager.activeInputs,
//     time: dt,
//     chart: {
//       notes: gameState.chart.notes,
//     },
//   };

//   const { world: updatedWorld, previousFrameMeta } = updateGameState(
//     world,
//     engineConfiguration
//   );

//   updateUI(updatedWorld, previousFrameMeta);

//   for (const [id, n] of updatedWorld.chart.notes) {
//     const ypos = (n.ms - dt) * MULTIPLIER;
//     const xpos = n.columns[0] * NOTE_WIDTH;
//     const $note = noteMap.get(id);

//     if (n.hitTiming) {
//       if (!$note) {
//         throw Error(`Tried to access note ${id} but wasn't in noteMap!`);
//       }
//       $note.remove();
//     } else {
//       if ($note) {
//         updateNote($note, xpos, ypos);
//       } else if (ypos < window.innerHeight) {
//         appendNote(id, xpos, ypos);
//       }
//     }
//   }

//   if (dt - lastDebugUpdate > 1000) {
//     writeDebugToHtml({
//       ticks,
//       afterUpdate: () => {
//         lastDebugUpdate = dt;
//         ticks = 0;
//       },
//     });
//   }

//   gameState.inputManager.update(dt);

//   window.requestAnimationFrame(() =>
//     gameLoop({
//       ...gameState,
//       chart: {
//         notes: updatedWorld.chart.notes,
//       },
//       combo: updatedWorld.combo,
//     })
//   );
// }

$start.addEventListener("click", async () => {
  const chart = await fetchData();
  const gameConfig: GameConfig = {
    chart,
    preSongPadding: PADDING_MS,
    engineConfiguration,
    codeColumns: codeColumnMap,
    inputManagerConfig: {
      onKeyCallback: new Map([
        ["KeyD", () => targetFlash(0)],
        ["KeyF", () => targetFlash(1)],
        ["KeyJ", () => targetFlash(2)],
        ["KeyK", () => targetFlash(3)],
      ]),
    },
  };

  const lifecycle: GameLifecycle = {
    onUpdate: (world: World, previousFrameMeta: PreviousFrameMeta) => {
      for (const [id, n] of world.chart.notes) {
        const ypos = (n.ms - world.time) * MULTIPLIER;
        const xpos = n.columns[0] * NOTE_WIDTH;
        const $note = noteMap.get(id);

        if (n.hitTiming) {
          if (!$note) {
            throw Error(`Tried to access note ${id} but wasn't in noteMap!`);
          }
          $note.remove();
        } else {
          if ($note) {
            updateNote($note, xpos, ypos);
          } else if (ypos < window.innerHeight) {
            appendNote(id, xpos, ypos);
          }
        }
      }

      updateUI(world, previousFrameMeta);
    },
  };

  const game = new Game(gameConfig, lifecycle);

  game.start()
  // ensure clear even during HMR
});
