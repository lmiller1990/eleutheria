import { windows, windowsWithMiss } from "./gameConfig";

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

export function createElements($root: HTMLDivElement, columnCount: number) {
  const targetCols = Array(columnCount)
    .fill(0)
    .map((_, idx) => {
      const outlineEl = createElement("div", {
        id: `target-col-el-${idx}`,
        className: "target-col-el rounded-xl w-full h-full",
      });

      const targetEl = createElement(
        "div",
        {
          id: `target-col-${idx}`,
          className: "target-col rounded-xl",
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

  const debugging = [
    { name: "Live Notes", id: "debug-live-notes" },
    {
      name: "FPS",
      id: "debug-fps",
    },
  ];

  const debugRows = debugging
    .map((field) => {
      return `
      <tr class="align-left">
        <th>${field.name}</th>
        <td id="${field.id}"></td>
      </tr>
    `;
    })
    .join("");

  const debugTable = `
    <table id="debug">
    ${debugRows}
    </table>
  `;

  const cover = createElement("div", { id: "lane-cover" });

  const html = `
    ${debugTable}

    <div id="targets" class="w-full">
      ${cover}
      <div id="target-line">
        ${targetCols}
      </div>

      ${cols}

      <div id="timing"></div>
      <div id="combo"></div>
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
    cover: $("#lane-cover"),
    targets: $("#targets"),
    targetLine: $("#target-line"),
    timing: $("#timing"),
    combo: $("#combo"),
    debug: $("#debug"),
    debugLiveNoteCount: $("#debug-live-notes"),
    debugFps: $("#debug-fps"),
  } as const;
}

export type Elements = ReturnType<typeof createElements>;

export function $tapNote(
  classes: string = "",
  column: number,
  textContent: string = ""
) {
  const d = document.createElement("div");
  d.className = `note note-${column} ${classes}`;
  if (textContent) {
    // d.textContent = textContent;
  }
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

const TIMING_CLASSES = windowsWithMiss;

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
    if (timingWindow === "miss") {
      text = `${timingWindow}`;
    } else if (timing < 0) {
      // early
      text = `-${timingWindow}`;
    } else {
      // late
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
