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

export const $targets = $("#targets");
export const $targetLine = $("#target-line");
export const $timing = $("#timing");
export const $combo = $("#combo");
export const $debug = $("#debug");
export const $debugLiveNoteCount = $("#debug-live-notes");
export const $debugFps = $("#debug-fps");

$targets.appendChild($timing);
//
export function $note() {
  const d = document.createElement("div");
  d.className = "note";
  return d;
}

export const $start = $<HTMLButtonElement>("#start");
export const $stop = $<HTMLButtonElement>("#stop");

export const colElements = new Map<0 | 1 | 2 | 3, HTMLDivElement>([
  [0, $("#col-0")],
  [1, $("#col-1")],
  [2, $("#col-2")],
  [3, $("#col-3")],
]);

export const $targetColElements = new Map<0 | 1 | 2 | 3, HTMLDivElement>([
  [0, $("#target-col-0")],
  [1, $("#target-col-1")],
  [2, $("#target-col-2")],
  [3, $("#target-col-3")],
]);

const TARGET_FLASH_CLASS = "target-col-flash";
const NOTE_HIT_FLASH_CLASS = "target-col-flash-note-hit";

const CLASSES = [TARGET_FLASH_CLASS, NOTE_HIT_FLASH_CLASS] as const;

const TIMING_CLASSES = windows;

export function judgementFlash(timingWindow: string, text: string) {
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

export function targetFlash(column: 0 | 1 | 2 | 3) {
  const flip = createFlip(CLASSES);
  const $el = $targetColElements.get(column);
  flip($el, TARGET_FLASH_CLASS);
}

export function targetNoteHitFlash(column: 0 | 1 | 2 | 3) {
  const flip = createFlip(CLASSES);
  const $el = $targetColElements.get(column);
  flip($el, NOTE_HIT_FLASH_CLASS);
}
