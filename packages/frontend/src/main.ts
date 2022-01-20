import "./style.css";

const url = "http://localhost:4000/mecha.ogg";
const audio = new Audio(url);

const bpm = 180;

const _4th = 60000 / bpm;
const _8th = _4th / 2;

interface Note {
  idx: number;
  t: number;
  $el: HTMLDivElement | undefined;
}

const chart = Array(100)
  .fill(null)
  .map<Note>((_, idx) => {
    return {
      idx,
      t: idx * _8th,
      $el: undefined,
    };
  });

async function fetchAudio() {
  const context = new AudioContext();

  const res = await window.fetch(url);
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
  audioContext: AudioContext
}

function gameLoop(world: GameWorld) {
  const dt = world.audioContext.getOutputTimestamp().performanceTime;

  if (!dt) {
    throw Error("wtf");
  }

  for (const n of chart) {
    const ypos = n.t - dt;
    n.$el!.style.top = `${ypos}px`;
  }

  if (dt > 5000) {
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

audio.addEventListener("canplaythrough", async () => {
  for (const note of chart) {
    const $n = $note();
    $targets.appendChild($n);
    note.$el = $n;
    note.$el.style.top = `${note.t}px`;
  }

  const play = await fetchAudio();
  const audioContext = play();
  gameLoop({ audioContext });
});
