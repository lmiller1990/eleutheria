import type { ParsedChart } from "@packages/chart-parser";
import { padStart } from "@packages/audio-utils";
import "./style.css";

const SONG_ID = "175-bpm-test";

const url = (id: string) => `http://localhost:4000/${id}.ogg`;

const MULTIPLIER = 1.5;
const PADDING_MS = 2000;

interface GameNote {
  idx: number;
  t: number;
  cols: number[];
  $el: HTMLDivElement | undefined;
}

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

interface GameWorld {
  audioContext: AudioContext;
  notes: GameNote[];
  source: AudioBufferSourceNode;
  inputManager: InputManager;
}

interface Input {
  code: string;
  ms: number;
}

interface InputManagerConfig {
  maxWindowMs: number;
}

class InputManager {
  historicalInputs: Input[] = [];
  activeInputs: Input[] = [];
  config: InputManagerConfig;
  lastUpdateHash: string = "";

  constructor(private t0: number, config: Partial<InputManagerConfig>) {
    this.config = {
      ...config,
      maxWindowMs: 500,
    };
  }

  // arrow function for lexical this
  onKeyDown = (e: KeyboardEvent) => {
    this.activeInputs.push({
      code: e.code,
      ms: e.timeStamp,
    });
  };

  get activeInputHash() {
    return this.activeInputs
      .reduce((acc, curr) => `${acc}-${curr.ms}`, "")
      .toString();
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
    this.lastUpdateHash = this.activeInputHash;
  }

  listen() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  teardown() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
}

document.addEventListener("keydown", (e) => {
  console.log(e.code, e.timeStamp);
});

function gameLoop(world: GameWorld) {
  const dt = world.audioContext.getOutputTimestamp().performanceTime!;

  for (const n of world.notes) {
    const ypos = n.t - dt;
    const xpos = n.cols[0] * 50;
    n.$el!.style.top = `${ypos * MULTIPLIER}px`;
    n.$el!.style.left = `${xpos}px`;
  }

  if (dt > 16000) {
    world.source.stop();
    return;
  }

  world.inputManager.update(dt);
  window.requestAnimationFrame(() => gameLoop(world));
}

const $app = document.querySelector("#app")!;
const $targets = document.createElement("div");
$targets.id = "targets";
$app.appendChild($targets);

const $note = () => {
  const d = document.createElement("div");
  d.className = "note";
  return d;
};

async function fetchData(id: string): Promise<ParsedChart> {
  const res = await window.fetch(`http://localhost:8000/songs/${id}`);
  return res.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchData(SONG_ID);

  const notes = data.notes.map<GameNote>((x) => ({
    idx: x.id,
    cols: x.columns,
    t: x.ms * 1000 + PADDING_MS + data.metadata.offset,
    $el: undefined,
  }));

  for (const note of notes) {
    const $n = $note();
    $targets.appendChild($n);
    note.$el = $n;
    note.$el.style.top = `${note.t * MULTIPLIER}px`;
  }

  const play = await fetchAudio();
  const { audioContext, source } = play();

  const inputManager = new InputManager(
    audioContext.getOutputTimestamp().performanceTime!,
    { maxWindowMs: 100 }
  );

  setTimeout(() => {
    inputManager.teardown();
    console.log(inputManager.activeInputs, inputManager.historicalInputs);
  }, 5000);

  inputManager.listen();

  gameLoop({ audioContext, notes, source, inputManager });
});
