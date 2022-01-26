import type { ParsedChart } from "@packages/chart-parser";
import { padStart, playBeep } from "@packages/audio-utils";
import {
  createChart,
  initGameState,
  EngineNote,
  updateGameState,
  World,
  EngineConfiguration,
} from "@packages/engine";
import { InputManager } from "./inputManager";
import "./style.css";

const SONG_ID = "rave";

const url = (id: string) => `http://localhost:4000/${id}.mp3`;

const windows = ["perfect", "great"] as const;

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

const MULTIPLIER = 1.5;
const PADDING_MS = 2000;

async function fetchAudio() {
  const audioContext = new AudioContext();

  const res = await window.fetch(url(SONG_ID));
  const buf = await res.arrayBuffer();
  let buffer = await audioContext.decodeAudioData(buf);
  buffer = padStart(audioContext, buffer, PADDING_MS);

  var gainNode = audioContext.createGain();
  gainNode.gain.value = 0.1; // 10 %
  gainNode.connect(audioContext.destination);

  return () => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    // use this for no assist tick
    // source.connect(audioContext.destination);
    source.connect(gainNode);
    source.start();
    return { audioContext, source };
  };
}

interface GameState {
  audioContext: AudioContext;
  source: AudioBufferSourceNode;
  notes: Map<string, EngineNote>;
  inputManager: InputManager;
}

const noteMap = new Map<string, HTMLDivElement>();

const codeColumnMap = new Map<string, number>([
  ["KeyD", 0],
  ["KeyF", 1],
  ["KeyJ", 2],
  ["KeyK", 3],
]);

const beeped = new Set<number>();

let t0: number;
let timeoutId: number;
let cancel: boolean = false;

function gameLoop(gameState: GameState) {
  if (cancel) {
    return;
  }

  const dt = gameState.audioContext.getOutputTimestamp().performanceTime! - t0;

  const world: World = {
    startTime: t0,
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
      const xpos = n.columns[0] * 100;
      if (ypos < 0 && !beeped.has(n.ms)) {
        playBeep();
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

  gameState.inputManager.update(dt);
  window.requestAnimationFrame(() => gameLoop(gameState));
}

const $app = document.querySelector("#app")!;
const $targets = document.createElement("div");
$targets.id = "targets";
$app.appendChild($targets);

const $timing = document.createElement("div");
$timing.id = "timing";
$targets.appendChild($timing);

const $note = (id: string) => {
  const d = document.createElement("div");
  d.className = "note";
  d.innerText = id;
  return d;
};

async function fetchData(id: string): Promise<ParsedChart> {
  const res = await window.fetch(`http://localhost:8000/songs/${id}`);
  return res.json();
}

const $start = document.createElement("button");
$start.innerText = "Start";
document.body.insertAdjacentElement("beforebegin", $start);

const $stop = document.createElement("button");
$stop.innerText = "Stop";
document.body.insertAdjacentElement("beforebegin", $stop);

$start.addEventListener("click", async () => {
  t0 = performance.now();
  // ensure clear even during HMR
  noteMap.clear();

  const data = await fetchData(SONG_ID);

  const chart = createChart({
    notes: data.notes,
    offset: PADDING_MS + data.metadata.offset,
  });

  const gs = initGameState(chart);

  for (const [id, note] of gs.notes) {
    const $n = $note(id);
    $n.style.display = "none";
    $targets.appendChild($n);
    $n.style.top = `${note.ms * MULTIPLIER}px`;
    noteMap.set(id, $n);
  }

  const inputManager = new InputManager(t0, codeColumnMap, {
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
