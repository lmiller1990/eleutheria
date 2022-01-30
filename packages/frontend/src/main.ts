import {
  createChart,
  initGameState,
  EngineNote,
  updateGameState,
  World,
  EngineConfiguration,
} from "@packages/engine";
import { fetchAudio, fetchData } from "./fetchData";
import { InputManager } from "./inputManager";
import {
  $note,
  $targetLine,
  $timing,
  $start,
  $stop,
  $debugLiveNoteCount,
} from "./elements";
import "./style.css";

const windows = ["perfect", "great"] as const;

const NOTE_WIDTH = parseInt(
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--note-width"),
  10
);

const MULTIPLIER = 1.0;
export const PADDING_MS = 2000;

const config: EngineConfiguration = {
  maxHitWindow: 100,
  timingWindows: [
    {
      name: windows[0],
      windowMs: 50,
    },
    {
      name: windows[1],
      windowMs: 100,
    },
  ],
};

interface GameState {
  audioContext: AudioContext;
  source: AudioBufferSourceNode;
  notes: Map<string, EngineNote>;
  inputManager: InputManager;
  t0?: number;
}

const noteMap = new Map<string, HTMLDivElement>();

const codeColumnMap = new Map<string, number>([
  ["KeyD", 0],
  ["KeyF", 1],
  ["KeyJ", 2],
  ["KeyK", 3],
]);

const beeped = new Set<number>();

let timeoutId: number;
let cancel: boolean = false;
let lastDebugUpdate = 0;

function gameLoop(gameState: GameState) {
  if (!gameState.t0) {
    gameState.t0 = performance.now();
    gameState.inputManager.setOrigin(gameState.t0);
  }

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

  const newGameState = updateGameState(world, config);

  if (newGameState.previousFrameMeta.judgementResults.length) {
    // some notes were judged on the previous window
    for (const judgement of newGameState.previousFrameMeta.judgementResults) {
      const note = newGameState.chart.notes.get(judgement.noteId);
      if (!note) {
        throw Error(
          `Could not judged note with id ${judgement.noteId}. This should never happen.`
        );
      }

      gameState.inputManager.consume(judgement.inputs);

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

  for (const [id, n] of newGameState.chart.notes) {
    if (n.hitTiming) {
      noteMap.get(id)?.remove();
    } else {
      const ypos = (n.ms - dt) * MULTIPLIER;
      const xpos = n.columns[0] * NOTE_WIDTH;
      if (ypos < 0 && !beeped.has(n.ms)) {
        beeped.add(n.ms);
      }
      // assume it exists - this is the game loop, we need to go FAST
      // no time for null checks
      if (ypos < 2500) {
        const $el = noteMap.get(id)!;
        $el.style.display = "block";
        $el.style.top = `${ypos}px`;
        $el.style.left = `${xpos}px`;
      }
    }
  }

  if (dt > 4000) {
    // gameState.
    return;
  }

  if (dt - lastDebugUpdate > 1000) {
    const noteCount = document.querySelectorAll(".note");
    $debugLiveNoteCount.textContent = noteCount.length.toString();
    lastDebugUpdate = dt;
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

  for (const [id, note] of gs.notes) {
    const $n = $note();
    $n.style.display = "none";
    $targetLine.appendChild($n);
    $n.style.top = `${note.ms * MULTIPLIER}px`;
    noteMap.set(id, $n);
  }

  const inputManager = new InputManager(codeColumnMap, {
    maxWindowMs: 100,
  });

  inputManager.listen();

  const play = await fetchAudio();

  const { audioContext, source } = play();

  const gameState: GameState = {
    audioContext,
    source,
    inputManager,
    notes: gs.notes,
  };

  const stop = () => {
    gameState.inputManager.teardown();
    gameState.source.stop();
    cancel = true;
  };

  $stop.addEventListener("click", stop);

  gameLoop({ audioContext, source, inputManager, notes: gs.notes });
});
