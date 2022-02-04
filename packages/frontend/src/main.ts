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

interface GameState {
  audioContext: AudioContext;
  combo: number;
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

function updateUI(currentGameState: GameState, newGameState: UpdatedGameState) {
  if (newGameState.previousFrameMeta.judgementResults.length) {
    // some notes were judged on the previous window
    for (const judgement of newGameState.previousFrameMeta.judgementResults) {
      const note = newGameState.chart.notes.get(judgement.noteId);
      if (!note || !note.timingWindowName) {
        throw Error(
          `Could not judged note with id ${judgement.noteId}. This should never happen.`
        );
      }

      currentGameState.inputManager.consume(judgement.inputs);

      const text =
        note.timingWindowName === "perfect"
          ? note.timingWindowName
          : judgement.timing > 0
          ? `${note.timingWindowName}-`
          : `-${note.timingWindowName}`;

      judgementFlash(note.timingWindowName, text);
      targetNoteHitFlash(note.columns[0] as 0 | 1 | 2 | 3);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        $timing.innerText = "";
      }, 2000);
    }
  }

  $combo.innerText =
    newGameState.combo > 0 ? `${newGameState.combo} combo` : ``;
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
    combo: gameState.combo,
    inputs: gameState.inputManager.activeInputs,
    time: dt,
    chart: {
      notes: gameState.notes,
    },
  };

  const newGameState = updateGameState(world, engineConfiguration);

  updateUI(gameState, newGameState);

  for (const [id, n] of newGameState.chart.notes) {
    const ypos = (n.ms - dt) * MULTIPLIER;
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

  window.requestAnimationFrame(() =>
    gameLoop({
      ...gameState,
      notes: newGameState.chart.notes,
      combo: newGameState.combo,
    })
  );
}

$start.addEventListener("click", async () => {
  // ensure clear even during HMR
  noteMap.clear();

  const data = await fetchData();

  const chart = createChart({
    notes: data.notes.map((x) => ({ ...x, missed: false, canHit: true })),
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
    combo: 0,
    t0: startTime,
    inputManager,
    notes: gs.notes,
  };

  $stop.addEventListener("click", stop);
  gameState.inputManager.setOrigin(gameState.t0);

  gameLoop(gameState);
});
