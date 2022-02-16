import { windows } from "./config";

const $ = <T extends Element = HTMLDivElement>(sel: string) => {
  const el = document.querySelector<T>(sel);
  if (el) {
    return el;
  }

  throw new Error(
    `Expected element with selector ${sel} to exist, but it didn't.`
  );
};

type ColNum = 0 | 1 | 2 | 3;
type ColMap = Map<ColNum, HTMLDivElement>;

export function createElements($root: HTMLDivElement) {
  const html = `
    <button id="start">Start</button>
    <button id="stop">Stop</button>
    <table id="debug">
      <tr>
        <th>Live notes</th>
        <td id="debug-live-notes"></td>
        <th>FPS</th>
        <td id="debug-fps"></td>
      </tr>
    </table>

    <div id="targets">
      <div id="target-line">
        <div class="target-col" id="target-col-0"></div>
        <div class="target-col" id="target-col-1"></div>
        <div class="target-col" id="target-col-2"></div>
        <div class="target-col" id="target-col-3"></div>
      </div>
      <div class="col" id="col-0"></div>
      <div class="col" id="col-1"></div>
      <div class="col" id="col-2"></div>
      <div class="col" id="col-3"></div>
      <div id="timing"></div>
      <div id="combo"></div>
    </div>
  `;

  $root.innerHTML = html;

  const targetColElements: ColMap = new Map([
    [0, $("#target-col-0")],
    [1, $("#target-col-1")],
    [2, $("#target-col-2")],
    [3, $("#target-col-3")],
  ]);

  const colElements: ColMap = new Map([
    [0, $("#col-0")],
    [1, $("#col-1")],
    [2, $("#col-2")],
    [3, $("#col-3")],
  ]);

  return {
    targetColElements,
    colElements,
    targets: $("#targets"),
    targetLine: $("#target-line"),
    timing: $("#timing"),
    combo: $("#combo"),
    debug: $("#debug"),
    debugLiveNoteCount: $("#debug-live-notes"),
    debugFps: $("#debug-fps"),
  };
}

export type Elements = ReturnType<typeof createElements>;

export function $note() {
  const d = document.createElement("div");
  d.className = "note";
  return d;
}

const TARGET_FLASH_CLASS = "target-col-flash";
const NOTE_HIT_FLASH_CLASS = "target-col-flash-note-hit";

const CLASSES = [TARGET_FLASH_CLASS, NOTE_HIT_FLASH_CLASS] as const;

const TIMING_CLASSES = windows;

export function judgementFlash(
  $timing: HTMLDivElement,
  timingWindow: string,
  text: string
) {
  const flip = createFlip(TIMING_CLASSES);
  $timing.innerText = text;
  flip($timing, timingWindow);
}

const createFlip =
  (classes: readonly string[]) =>
  ($el: HTMLElement | undefined, klass: typeof classes[number]) => {
    if (!$el) {
      throw Error(`Could not find element to flip!`);
    }
    $el.classList.remove(...classes);
    void $el.offsetWidth;
    $el.classList.add(klass);
  };

export function targetFlash(targetColElements: ColMap, column: ColNum) {
  const flip = createFlip(CLASSES);
  const $el = targetColElements.get(column);
  flip($el, TARGET_FLASH_CLASS);
}

export function targetNoteHitFlash(targetColElements: ColMap, column: ColNum) {
  const flip = createFlip(CLASSES);
  const $el = targetColElements.get(column);
  flip($el, NOTE_HIT_FLASH_CLASS);
}
