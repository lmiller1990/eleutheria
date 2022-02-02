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
export const $debug = $("#debug");
export const $debugLiveNoteCount = $("#debug-live-notes");
export const $debugFps = $("#debug-fps");

$targets.appendChild($timing);

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

export function targetFlash(column: 0 | 1 | 2 | 3) {
  const $el = $targetColElements.get(column);
  if (!$el) {
    throw Error(`Could not find element for column ${column}`);
  }
  const klass = "target-col-flash";
  $el.classList.remove(klass);
  void $el.offsetWidth;
  $el.classList.add(klass);
}
