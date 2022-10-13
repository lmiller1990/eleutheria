// @ts-check

/**
 * @param {string} url
 * @returns {Promise<() => { audioContext: AudioContext, startTime?: number }>}
 */
async function fetchAudio(url) {
  const audioContext = new window.AudioContext();

  const res = await window.fetch(url);
  const buf = await res.arrayBuffer();
  const buffer = await audioContext.decodeAudioData(buf);

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 1.0;
  gainNode.connect(audioContext.destination);

  return () => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    source.start(0);
    const startTime = audioContext.getOutputTimestamp().performanceTime;

    return { audioContext, startTime };
  };
}

/**
 * A simple "chart"
 * 4th note at 135 bpm
 * 60/135 = 0.444...
 * A note every 0.444ms
 *
 * @returns {Array<{ el: HTMLDivElement; ms: number, timing?: number }>}
 */
function createChart() {
  const offsetMs = 60;
  const _4th = 60 / 135;
  const notes = [];

  const $gameplay = document.querySelector("#gameplay");

  for (let i = 1; i < 16; i++) {
    const el = document.createElement("div");
    el.className = "note";
    $gameplay.appendChild(el);
    notes.push({ ms: i * _4th * 1000 + offsetMs, el });
  }
  console.log(JSON.stringify(notes, null, 2))
  return notes;
}

/**
 * @param {Array<{ el: HTMLDivElement; ms: number, timing?: number }>} chart
 * @param {AudioContext} audioContext
 * @param {number} startTime
 * @param {InputManager} inputManager
 */
function gameLoop(chart, audioContext, startTime, inputManager) {
  const elapsed = audioContext.getOutputTimestamp().performanceTime - startTime;
  inputManager.process(chart);

  // calculate new position based on playback
  for (const note of chart) {
    note.el.style.top = `${note.ms - elapsed}px`;
  }

  inputManager.clear();
  requestAnimationFrame(() =>
    gameLoop(chart, audioContext, startTime, inputManager)
  );
}

class InputManager {
  /** @type {number | undefined} */
  #input;

  /**
   * @param {number} t0
   */
  constructor(t0) {
    window.addEventListener("keydown", (event) => {
      if (event.code !== "KeyJ") {
        return;
      }

      this.#input = event.timeStamp - t0;
    });
  }

  clear() {
    this.#input = undefined;
  }

  /**
   * @param {Array<{ el: HTMLDivElement, ms: number, timing?: number }>} notes
   */
  process(notes) {
    if (!this.#input) {
      return;
    }

    const $ul = document.querySelector("#timing");

    if (!$ul) {
      return;
    }

    $ul.innerHTML = "";

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (Math.abs(note.ms - this.#input) < 100) {
        // close enough to be considered hit!
        note.timing = note.ms - this.#input;
      }

      const $li = document.createElement("li");
      const content = note.timing ? `${note.timing.toFixed(0)}ms` : "-";
      const id = i.toString().padStart(2, "0");
      $li.textContent = `Note #${id}: ${content}`;
      $ul.appendChild($li);
    }
  }
}

async function start() {
  const play = await fetchAudio("/135bpm.wav");
  const chart = createChart();
  const { startTime, audioContext } = play();
  const inputManager = new InputManager(startTime);
  gameLoop(chart, audioContext, startTime, inputManager);
}
