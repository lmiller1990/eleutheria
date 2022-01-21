import type { ParsedChart } from "@packages/chart-parser";
import "./style.css";

const SONG_ID = "175-bpm-test";

const url = (id: string) => `http://localhost:4000/${id}.ogg`;

const audio = new Audio(url(SONG_ID));

const MULTIPLIER = 1.5

interface GameNote {
  idx: number;
  t: number;
  cols: number[]
  $el: HTMLDivElement | undefined;
}

async function fetchAudio() {
  const context = new AudioContext();

  const res = await window.fetch(url(SONG_ID));
  const buf = await res.arrayBuffer();
  const buffer = await context.decodeAudioData(buf);

  return () => {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
    return context;
  };
}

interface GameWorld {
  audioContext: AudioContext;
  notes: GameNote[]
}

function gameLoop(world: GameWorld) {
  const dt = world.audioContext.getOutputTimestamp().performanceTime;

  if (!dt) {
    throw Error("wtf");
  }

  for (const n of world.notes) {
    const ypos = n.t - dt;
    const xpos = n.cols[0] * 50
    n.$el!.style.top = `${ypos * MULTIPLIER}px`;
    n.$el!.style.left = `${xpos}px`;
  }

  if (dt > 8000) {
    return;
  }

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

audio.addEventListener("canplaythrough", async () => {
  const data = await fetchData(SONG_ID)

  const gameNotes = data.notes.map<GameNote>(x => ({
    idx: x.id,
    cols: x.columns,
    t: x.ms * 1000,
    $el: undefined
  }))

  for (const note of gameNotes) {
    const $n = $note();
    $targets.appendChild($n);
    note.$el = $n;
    note.$el.style.top = `${note.t * MULTIPLIER}px`;
  }
  console.log(gameNotes)

  const play = await fetchAudio();
  const audioContext = play();
  gameLoop({ audioContext, notes: gameNotes });
});
