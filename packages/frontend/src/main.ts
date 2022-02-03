import {
  createChart,
  initGameState,
  EngineNote,
  updateGameState,
  World,
  UpdatedGameState,
} from "@packages/engine";
import { fetchAudio, fetchData } from "./fetchData";
import { InputManager } from "./inputManager";
import {
  $note,
  $targetLine,
  $timing,
  $start,
  $stop,
  targetFlash,
  targetNoteHitFlash
} from "./elements";
import {
  engineConfiguration,
  windows,
  NOTE_WIDTH,
  MULTIPLIER,
  PADDING_MS,
  codeColumnMap,
} from "./config";
import { writeDebugToHtml } from "./debug";

interface GameState {
  audioContext: AudioContext;
  source: AudioBufferSourceNode;
  notes: Map<string, EngineNote>;
  inputManager: InputManager;
  t0: number;
}

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

function handleJudgement(
  currentGameState: GameState,
  newGameState: UpdatedGameState
) {
  if (newGameState.previousFrameMeta.judgementResults.length) {
    // some notes were judged on the previous window
    for (const judgement of newGameState.previousFrameMeta.judgementResults) {
      const note = newGameState.chart.notes.get(judgement.noteId);
      if (!note) {
        throw Error(
          `Could not judged note with id ${judgement.noteId}. This should never happen.`
        );
      }

      currentGameState.inputManager.consume(judgement.inputs);

      $timing.classList.add(note.timingWindowName || "");
      $timing.classList.remove(
        ...windows.filter((x) => x !== note.timingWindowName)
      );
      $timing.innerText =
        `${judgement.timing.toFixed()} ${note.timingWindowName}` ?? "";

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        $timing.innerText = "";
      }, 2000);
    }
  }
}

function gameLoop(gameState: GameState) {
  ticks += 1;
  if (cancel) {
    return;
  }

  const dt =
    gameState.audioContext.getOutputTimestamp().performanceTime! - gameState.t0;

  const world: World = {
    startTime: gameState.t0,
    inputs: gameState.inputManager.activeInputs,
    time: dt,
    chart: {
      notes: gameState.notes,
    },
  };

  const newGameState = updateGameState(world, engineConfiguration);

  handleJudgement(gameState, newGameState);

  for (const [id, n] of newGameState.chart.notes) {
    const ypos = (n.ms - dt) * MULTIPLIER;
    const xpos = n.columns[0] * NOTE_WIDTH;
    const $note = noteMap.get(id);

    if (n.hitTiming) {
      if (!$note) {
        throw Error(`Tried to access note ${id} but wasn't in noteMap!`);
      }
      $note.remove();
      targetNoteHitFlash(n.columns[0] as 0 | 1 | 2  | 3)
    } else {
      if ($note) {
        updateNote($note, xpos, ypos);
      } else if (ypos < window.innerHeight) {
        appendNote(id, xpos, ypos);
      }
    }
  }

  if (dt - lastDebugUpdate > 1000) {
    writeDebugToHtml({
      ticks,
      afterUpdate: () => {
        lastDebugUpdate = dt;
        ticks = 0;
      },
    });
  }

  gameState.inputManager.update(dt);
  window.requestAnimationFrame(() => gameLoop(gameState));
}

$start.addEventListener("click", async () => {
  // ensure clear even during HMR
  noteMap.clear();

  const data = await fetchData();

  const chart = createChart({
    notes: data.notes,
    offset: PADDING_MS + data.metadata.offset,
  });

  const gs = initGameState(chart);

  const inputManager = new InputManager(codeColumnMap, {
    ...engineConfiguration,
    onKeyCallback: new Map([
      ["KeyD", () => targetFlash(0)],
      ["KeyF", () => targetFlash(1)],
      ["KeyJ", () => targetFlash(2)],
      ["KeyK", () => targetFlash(3)],
    ]),
  });

  inputManager.listen();

  const stop = () => {
    gameState.inputManager.teardown();
    gameState.source.stop();
    cancel = true;
  };

  const play = await fetchAudio();

  const { audioContext, source, startTime } = play();

  const gameState: GameState = {
    audioContext,
    source,
    t0: startTime,
    inputManager,
    notes: gs.notes,
  };

  $stop.addEventListener("click", stop);
  gameState.inputManager.setOrigin(gameState.t0);

  gameLoop(gameState);
});
