import { ChartMetadata } from "@packages/chart-parser";
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

function createElement(
  tagName: string,
  props: { id?: string; className?: string },
  children: string[] = []
) {
  const { className = "", id = "" } = props;
  return `
    <${tagName} 
     class="${className}" 
     id="${id}"
    >
      ${children.join("")}
    </${tagName}>`;
}

export function createElements(
  $root: HTMLDivElement,
  columnCount: number,
  metadata: ChartMetadata
) {
  const targetCols = Array(columnCount)
    .fill(0)
    .map((_, idx) => {
      const outlineEl = createElement("div", {
        id: `target-col-el-${idx}`,
        className: "target-col-el rounded-border-m border-red-3 w-100 h-100",
      });

      const targetEl = createElement(
        "div",
        {
          id: `target-col-${idx}`,
          className: "target-col rounded-border-m",
        },
        [outlineEl]
      );

      return targetEl;
    })
    .join("");

  const cols = Array(columnCount)
    .fill(0)
    .map((_, idx) => {
      return createElement("div", { id: `col-${idx}`, className: "col" });
    })
    .join("");

  const scoreTableRows = windows
    .map(
      (win) => `
      <tr>
        <td>${win}</td>
        <td id="timing-${win}">0</td>
      </tr>
    `
    )
    .join("");

  const scorePanelTable = `
      <table id="score-table" class="upcase">
        <tr>
          <td>Score</td>
          <td>52.55% (-4.53%)</td>
        </tr>

        ${scoreTableRows}

        <tr>
          <td>Miss</td>
          <td id="timing-miss">0</td>
        </tr>
      </table>
    `;

  const html = `
    <table id="debug">
      <tr>
        <th>Live notes</th>
        <td id="debug-live-notes"></td>
        <th>FPS</th>
        <td id="debug-fps"></td>
      </tr>
    </table>

    <div id="lhs" class="w-100 margin-left-2rem">
      <div id="lhs-panel" class="outline-2px outline-offset-[-5px] outline-red-1 gray-1 margin-top-2rem padding-s rounded-border-s">
        <table>
          <tr><td>${metadata.title}</td></tr>
          <tr><td>Artist</td></tr>
          <tr><td>${metadata.bpm} BPM</td></tr>
          <tr><td>Visualized by XXXX</td></tr>
        </table>
      </div>
    </div>

    <div id="targets" class="w-100 shadow-h-4">
      <div id="target-line">
        ${targetCols}
      </div>

      ${cols}

      <div id="timing"></div>
      <div id="combo"></div>
    </div>

    <div id="rhs" class="w-100 margin-right-2rem">
      <!-- score panel -->
      <div id="rhs-panel" class="outline-2px outline-offset-[-5px] outline-red-1 gray-1 margin-top-2rem padding-s rounded-border-s">
        ${scorePanelTable}
      </div>

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
    scoreTable: {
      absolute: $("#score-table").querySelector("#timing-absolute")!,
      perfect: $("#score-table").querySelector("#timing-perfect")!,
      great: $("#score-table").querySelector("#timing-great")!,
      miss: $("#score-table").querySelector("#timing-miss")!,
    },
  };
}

export type Elements = ReturnType<typeof createElements>;

export function $tapNote(classes: string = "", column: number) {
  const d = document.createElement("div");
  d.className = `note note-${column} rounded-border-m ${classes}`;
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
  timing: number
) {
  const flip = createFlip(TIMING_CLASSES.map((x) => `timing-${x}`));
  let text: string;
  if (timingWindow === windows[0]) {
    text = timingWindow;
  } else {
    // early
    if (timing < 0) {
      text = `-${timingWindow}`;
    } else {
      text = `${timingWindow}-`;
    }
  }
  $timing.innerText = text;
  flip($timing, `timing-${timingWindow}`);
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
