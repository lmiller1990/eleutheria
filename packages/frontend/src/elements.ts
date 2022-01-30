export const $targets = document.querySelector<HTMLDivElement>("#targets")!;
export const $targetLine =
  document.querySelector<HTMLDivElement>("#target-line")!;
export const $timing = document.querySelector<HTMLDivElement>("#timing")!;
export const $debug = document.querySelector<HTMLDivElement>("#debug")!;
export const $debugLiveNoteCount =
  document.querySelector<HTMLDivElement>("#debug-live-notes")!;

$targets.appendChild($timing);

export function $note() {
  const d = document.createElement("div");
  d.className = "note";
  return d;
}

export const $start = document.querySelector<HTMLButtonElement>("#start")!;
export const $stop = document.querySelector<HTMLButtonElement>("#stop")!;

export const colElements = new Map<0 | 1 | 2 | 3, HTMLDivElement>([
  [0, document.querySelector<HTMLDivElement>("#col-0")!],
  [1, document.querySelector<HTMLDivElement>("#col-1")!],
  [2, document.querySelector<HTMLDivElement>("#col-2")!],
  [3, document.querySelector<HTMLDivElement>("#col-3")!],
]);
