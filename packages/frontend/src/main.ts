import type { ParsedChart } from "@packages/chart-parser";
import { padStart } from "@packages/audio-utils";
import {
  createChart,
  initGameState,
  EngineNote,
  Input,
  updateGameState,
  World,
  EngineConfiguration,
} from "@packages/engine";
import "./style.css";

const SONG_ID = "175-bpm-test";

const url = (id: string) => `http://localhost:4000/${id}.ogg`;

const windows = ['perfect', 'great'] as const

const config: EngineConfiguration = {
  maxHitWindow: 100,
  timingWindows: [
    {
      name: windows[0],
      windowMs: 50
    },
    {
      name: windows[1],
      windowMs: 100
    }
  ]
}

const MULTIPLIER = 0.75;
const PADDING_MS = 2000;

async function fetchAudio() {
  const audioContext = new AudioContext();

  const res = await window.fetch(url(SONG_ID));
  const buf = await res.arrayBuffer();
  let buffer = await audioContext.decodeAudioData(buf);
  buffer = padStart(audioContext, buffer, PADDING_MS);

  return () => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
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

interface InputManagerConfig {
  maxWindowMs: number;
}

const codeColumnMap = new Map<string, number>([
  ["KeyD", 0],
  ["KeyF", 1],
  ["KeyJ", 2],
  ["KeyK", 3],
]);

class InputManager {
  historicalInputs: Input[] = [];
  activeInputs: Input[] = [];
  config: InputManagerConfig;
  lastUpdateHash: string = "";

  constructor(
    private t0: number,
    private codeColumnMap: Map<string, number>,
    config: Partial<InputManagerConfig>
  ) {
    this.config = {
      ...config,
      maxWindowMs: 500,
    };
  }

  // arrow function for lexical this
  onKeyDown = (e: KeyboardEvent) => {
    const column = this.codeColumnMap.get(e.code);
    if (!column) {
      return;
    }

    this.activeInputs.push({
      id: e.timeStamp.toString(),
      column,
      ms: e.timeStamp,
    });
  };

  get activeInputHash() {
    return this.activeInputs
      .reduce((acc, curr) => `${acc}-${curr.ms}`, "")
      .toString();
  }

  consume (ids: string[]) {
    const inactive = this.activeInputs.filter(x => ids.includes(x.id))
    this.historicalInputs.push(...inactive)
    this.activeInputs = this.activeInputs.filter(x => !ids.includes(x.id))
    this.updateLastUpdateHash()
  }

  update(now: number) {
    // no need to update - nothing has changed!
    if (this.activeInputHash === this.lastUpdateHash) {
      return;
    }

    const activeInputs: Input[] = [];

    for (const input of this.activeInputs) {
      if (now - input.ms > this.config.maxWindowMs) {
        this.historicalInputs.push(input);
      } else {
        activeInputs.push(input);
      }
    }

    this.activeInputs = activeInputs;
    this.updateLastUpdateHash()
  }

  updateLastUpdateHash () {
    this.lastUpdateHash = this.activeInputHash;
  }

  listen() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  teardown() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
}

function gameLoop(gameState: GameState) {
  const dt = gameState.audioContext.getOutputTimestamp().performanceTime!;

  const world: World = {
    startTime: 0,
    inputs: gameState.inputManager.activeInputs,
    time: dt,
    chart: {
      notes: gameState.notes
    }
  }

  const newGameState = updateGameState(world, config)

  if (newGameState.previousFrameMeta.judgementResults.length) {
    // some notes were judged on the previous window
    for (const judgement of newGameState.previousFrameMeta.judgementResults) {
      const note = newGameState.chart.notes.get(judgement.noteId)
      if (!note) {
        throw Error(
          `Could not judged note with id ${judgement.noteId}. This should never happen.`
        )
      }
      console.info(`Got ${note.id} at ${note.hitTiming} for ${note.timingWindowName}`)
      gameState.inputManager.consume(judgement.inputs)
      // window.timingFlash({
      //   column: note.code as Column,
      //   timingWindowName: note.timingWindowName
      // })
    }
  }

  for (const [id, n] of gameState.notes) {
    const ypos = n.ms - dt;
    const xpos = n.columns[0] * 50;
    // assume it exists - this is the game loop, we need to go FAST
    // no time for null checks
    const $el = noteMap.get(id)!;
    $el.style.top = `${ypos * MULTIPLIER}px`;
    $el.style.left = `${xpos}px`;
  }

  if (dt > 16000) {
    gameState.inputManager.teardown();
    gameState.source.stop();
    return;
  }

  gameState.inputManager.update(dt);
  window.requestAnimationFrame(() => gameLoop(gameState));
}

const $app = document.querySelector("#app")!;
const $targets = document.createElement("div");
$targets.id = "targets";
$app.appendChild($targets);

const $note = (id: string) => {
  const d = document.createElement("div");
  d.className = "note";
  d.innerText = id
  return d;
};

async function fetchData(id: string): Promise<ParsedChart> {
  const res = await window.fetch(`http://localhost:8000/songs/${id}`);
  return res.json();
}

// interface UINote extends BaseNote {
//   $el: HTMLDivElement | undefined;
// }

document.addEventListener("DOMContentLoaded", async () => {
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
    $targets.appendChild($n);
    $n.style.top = `${note.ms * MULTIPLIER}px`;
    noteMap.set(id, $n);
  }

  const play = await fetchAudio();
  const { audioContext, source } = play();

  const inputManager = new InputManager(
    audioContext.getOutputTimestamp().performanceTime!,
    codeColumnMap,
    { maxWindowMs: 100 }
  );

  setTimeout(() => {
    // console.log(inputManager.activeInputs, inputManager.historicalInputs);
  }, 5000);

  inputManager.listen();

  gameLoop({ audioContext, source, inputManager, notes: gs.notes });
});
