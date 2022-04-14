import { ChartMetadata } from "@packages/chart-parser";
import './webComponents'
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

type ColMap = Map<number, HTMLDivElement>;

function createElement(tagName: string, id?: string, className?: string) {
  return `
    <${tagName} 
     class="${className || ""}" 
     id="${id || ""}"
    ></${tagName}>`;
}

export function createElements($root: HTMLDivElement, columnCount: number, metadata: ChartMetadata) {
  const targetCols = Array(columnCount)
    .fill(0)
    .map((_, idx) => createElement("div", `target-col-${idx}`, "target-col"))
    .join("");
  const cols = Array(columnCount)
    .fill(0)
    .map((_, idx) => createElement("div", `col-${idx}`, "col"))
    .join("");

  const html = `
    <table id="debug">
      <tr>
        <th>Live notes</th>
        <td id="debug-live-notes"></td>
        <th>FPS</th>
        <td id="debug-fps"></td>
      </tr>
    </table>

    <div id="lhs" class="w-100 margin-m">
      <!-- banner -->
      <b-panel>
        <img class="rounded-border-m" src="${metadata.banner}" />
      </b-panel>

      <div class="margin-vertical-s">
        <ul>
          <li>${metadata.title}</li>
          <li>Artist</li>
          <li>${metadata.bpm} BPM</li>
        <ul>
      </div>
    </div>

    <div id="targets" class="w-100">
      <div id="target-line">
        ${targetCols}
      </div>

      ${cols}

      <div id="timing"></div>
      <div id="combo"></div>
    </div>

    <div id="rhs" class="w-100 margin-m">
      <!-- score panel -->
      <b-panel>
        <table>
          <tr>
            <td>Score</td>
            <td>52.55% (-4.53%)</td>
          </tr>

          <tr>
            <td>Perfect</td>
            <td>120</td>
          </tr>

          <tr>
            <td>Great</td>
            <td>12</td>
          </tr>

          <tr>
            <td>Miss</td>
            <td>5</td>
          </tr>

        </table>
      </b-panel>

    </div>
  `;

  $root.innerHTML = html;

  const targetColElements: ColMap = new Map(
    Array(columnCount)
      .fill(0)
      .map((_, idx) => [idx, $(`#target-col-${idx}`)])
  );

  const colElements: ColMap = new Map(
    Array(columnCount)
      .fill(0)
      .map((_, idx) => [idx, $(`#col-${idx}`)])
  );

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

export function $tapNote() {
  const d = document.createElement("div");
  d.className = "note";
  return d;
}

export function $holdNote() {
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

export function targetFlash(targetColElements: ColMap, column: number) {
  const flip = createFlip(CLASSES);
  const $el = targetColElements.get(column);
  flip($el, TARGET_FLASH_CLASS);
}

export function targetNoteHitFlash(targetColElements: ColMap, column: number) {
  const flip = createFlip(CLASSES);
  const $el = targetColElements.get(column);
  flip($el, NOTE_HIT_FLASH_CLASS);
}
