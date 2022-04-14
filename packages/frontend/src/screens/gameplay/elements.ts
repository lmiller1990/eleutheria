import { ChartMetadata } from "@packages/chart-parser";
import "./webComponents";
import { windows } from "./config";

const logo = `
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  xmlns:xlink="http://www.w3.org/1999/xlink" 
  version="1.1" 
  width="3161.9492267289174" 
  height="1081.1205135687192" 
  viewBox="0 0 3161.9492267289174 1081.1205135687192"
  style="height: 100%; width: 100%;"
>
  <g transform="scale(8.097461336445871) translate(10, 10)">
    <defs id="SvgjsDefs1327">
      <linearGradient id="SvgjsLinearGradient1334">
        <stop id="SvgjsStop1335" stop-color="#2d388a" offset="0"></stop>
        <stop id="SvgjsStop1336" stop-color="#00aeef" offset="1"></stop>
      </linearGradient>
      <linearGradient id="SvgjsLinearGradient1337">
        <stop id="SvgjsStop1338" stop-color="#2d388a" offset="0"></stop>
        <stop id="SvgjsStop1339" stop-color="#00aeef" offset="1"></stop>
      </linearGradient>
    </defs>
    <g id="SvgjsG1328" featureKey="symbolFeature-0" transform="matrix(33.85431194760621,0,0,33.85431194760621,-27.895953077113507,-27.862099201026737)" fill="url(#SvgjsLinearGradient1334)">
      <g xmlns="http://www.w3.org/2000/svg">
        <path d="M3.726,1.855C3.44,2.127,3.042,2.237,2.661,2.292c-0.34,0.05-0.695,0.071-0.999,0.203C1.344,2.634,1.144,2.864,1.16,3.22   c0.01,0.214,0.125,0.423,0.287,0.584C1.492,3.84,1.538,3.874,1.586,3.905C1.583,3.899,1.58,3.892,1.575,3.886   C1.382,3.621,1.232,2.862,2.242,2.697C2.445,2.664,2.648,2.63,2.85,2.584c0.178-0.041,0.496-0.141,0.531-0.16   c0.029-0.017-0.189,0.228-0.857,0.42C1.463,3.149,1.789,4.03,2.113,4.131C2.237,4.161,2.367,4.176,2.5,4.176   c0.926,0,1.677-0.75,1.677-1.676c0-0.333-0.097-0.643-0.264-0.903C3.868,1.695,3.805,1.779,3.726,1.855z"></path>
        <path d="M0.824,2.5c0,0.184,0.03,0.359,0.084,0.525c0.02-0.182,0.082-0.354,0.198-0.5c0.21-0.267,0.536-0.392,0.875-0.459   C2.319,2,2.679,1.992,3.026,1.908c0.192-0.046,0.387-0.121,0.542-0.244C3.697,1.56,3.757,1.402,3.623,1.255   C3.574,1.211,3.522,1.169,3.468,1.131c0.098,0.201,0.022,0.5-0.773,0.578C2.491,1.73,2.288,1.749,2.087,1.777   C2.028,1.785,1.955,1.796,1.88,1.809c0,0,0.066-0.082,0.532-0.188c0.958-0.216,0.779-0.633,0.495-0.748   c-0.13-0.032-0.267-0.05-0.407-0.05C1.574,0.824,0.824,1.574,0.824,2.5z"></path>
      </g>
    </g>
    <g id="SvgjsG1329" featureKey="nameFeature-0" transform="matrix(1.8389308189922313,0,0,1.8389308189922313,134.00000087687056,-3.3893046824401303)" fill="#137dc5">
      <path d="M13.24 37.84 c-1.5733 1.44 -3.7068 2.1602 -6.4 2.1602 l-6.84 0 l0 -30 l5.84 0 c1.6 0 2.9333 0.20668 4 0.62 s1.92 0.97332 2.56 1.68 s1.0867 1.5267 1.34 2.46 s0.38 1.9066 0.38 2.92 c0 1.0933 -0.32668 2.1266 -0.98 3.1 s-1.5266 1.8866 -2.62 2.74 c0.42668 0.26668 0.76 0.47336 1 0.62004 s0.46668 0.28668 0.68 0.42 c0.34668 0.29332 0.73336 0.64664 1.16 1.06 s0.82 0.89332 1.18 1.44 s0.66 1.1667 0.9 1.86 s0.36 1.4666 0.36 2.32 c0 1.4933 -0.22 2.7733 -0.66 3.84 s-1.0733 1.9867 -1.9 2.76 z M6.8 12 l-4.72 0.000078124 l0 10.8 l5.12 0 c0.72 0 1.38 -0.13332 1.98 -0.4 s1.12 -0.63336 1.56 -1.1 s0.78668 -1.0067 1.04 -1.62 s0.38 -1.28 0.38 -2 c0 -0.50668 -0.07332 -1.0934 -0.22 -1.76 s-0.42 -1.2867 -0.82 -1.86 s-0.94668 -1.06 -1.64 -1.46 s-1.5866 -0.6 -2.68 -0.6 z M7.04 24.8 l-4.96 0.000078124 l0 13.08 l4.28 0 c0.88 0 1.76 -0.10668 2.64 -0.32 s1.68 -0.57332 2.4 -1.08 s1.3 -1.1734 1.74 -2 s0.66 -1.8534 0.66 -3.08 c0 -1.12 -0.17332 -2.1 -0.52 -2.94 s-0.82668 -1.5267 -1.44 -2.06 s-1.3333 -0.93332 -2.16 -1.2 s-1.7067 -0.4 -2.64 -0.4 z M37.328 40 l-6.6 -12.44 l-6.12 0 l0 12.44 l-1.96 0 l0 -30 l6.8 0 c1.5733 0 2.92 0.23332 4.04 0.7 s2.04 1.1 2.76 1.9 s1.2533 1.7267 1.6 2.78 s0.52 2.1533 0.52 3.3 c0 1.9467 -0.5 3.7 -1.5 5.26 s-2.3133 2.7 -3.94 3.42 l7.04 12.64 l-2.64 0 z M29.168 11.84 l-4.56 -0.000039062 l0 13.68 l4.84 0 c1.36 0 2.48 -0.20668 3.36 -0.62 s1.5667 -0.94664 2.06 -1.6 s0.84 -1.4 1.04 -2.24 s0.3 -1.7 0.3 -2.58 c0 -0.93332 -0.16 -1.8 -0.48 -2.6 s-0.78 -1.5 -1.38 -2.1 s-1.3333 -1.0733 -2.2 -1.42 s-1.86 -0.52 -2.98 -0.52 z M47.29600000000001 40 l0 -30 l14.72 0 l0 2.32 l-12.64 0 l0 11.4 l12.52 0 l0 1.84 l-12.52 0 l0 12.12 l12.92 0 l0 2.32 l-15 0 z M69.98400000000001 40 l0 -30 l14.72 0 l0 2.32 l-12.64 0 l0 11.4 l12.52 0 l0 1.84 l-12.52 0 l0 12.12 l12.92 0 l0 2.32 l-15 0 z M91.43200000000002 40 l0 -3.56 l13.92 -24.2 l-13.92 0 l0 -2.24 l15.6 0 l0 3.56 l-13.8 24.2 l13.8 0 l0 2.24 l-15.6 0 z M113.60000000000002 40 l0 -30 l14.72 0 l0 2.32 l-12.64 0 l0 11.4 l12.52 0 l0 1.84 l-12.52 0 l0 12.12 l12.92 0 l0 2.32 l-15 0 z"></path>
    </g>
    <g id="SvgjsG1330" featureKey="sloganFeature-0" transform="matrix(1.345795756694591,0,0,1.345795756694591,138,72.65195640056035)" fill="url(#SvgjsLinearGradient1337)">
      <path d="M5.48 20.04 l-2.04 0 l-1.1 -3.02 l-0.44 0 l0 3.02 l-1.9 0 l0 -14.32 l2.98 0 c1.32 0 2.38 1.06 2.38 2.38 l0 6.54 c0 0.86 -0.44 1.6 -1.12 2.02 z M1.9 7.619999999999999 l0 7.5 l1.08 0 c0.26 0 0.48 -0.22 0.48 -0.48 l0 -6.54 c0 -0.26 -0.22 -0.48 -0.48 -0.48 l-1.08 0 z M19.2605 5.720000000000001 l1.9 0 l0 14.26 l-1.9 0 l0 -7.54 l-1.7 0 l0 7.54 l-1.9 0 l0 -14.26 l1.9 0 l0 4.84 l1.7 0 l0 -4.84 z M38.101 5.720000000000001 l-2.68 8.68 l0 5.6 l-1.94 0 l0 -5.62 l-2.46 -8.66 l2 0 l1.46 5.14 l1.6 -5.14 l2.02 0 z M55.2015 5.68 l0 1.92 l-2.38 0 l0 12.42 l-1.92 0 l0 -12.42 l-2.62 0 l0 -1.92 l6.92 0 z M68.642 5.720000000000001 l1.9 0 l0 14.26 l-1.9 0 l0 -7.54 l-1.7 0 l0 7.54 l-1.9 0 l0 -14.26 l1.9 0 l0 4.84 l1.7 0 l0 -4.84 z M86.5225 5.68 l3.34 0 l0 14.28 l-1.88 0 l0 -11.3 l-1.78 11.34 l-0.74 0 l-0.18 -0.04 l-0.16 0.04 l-0.74 0 l-1.76 -11.34 l0 11.3 l-1.9 0 l0 -14.28 l3.36 0 l1.22 8.08 z M116.1835 20.16 l-0.44 0 c-1.4 0 -2.52 -1.12 -2.52 -2.52 l0 -9.64 c0 -1.4 1.12 -2.54 2.52 -2.54 l0.44 0 c1.4 0 2.52 1.14 2.52 2.54 l0 1.02 l-1.96 0 l0 -1.02 c0 -0.34 -0.24 -0.58 -0.56 -0.58 l-0.44 0 c-0.3 0 -0.58 0.24 -0.58 0.58 l0 9.64 c0 0.3 0.28 0.58 0.58 0.58 l0.44 0 c0.32 0 0.56 -0.28 0.56 -0.58 l0 -5.2 l-1.12 0 l0 -1.94 l3.08 0 l0 7.14 c0 1.4 -1.12 2.52 -2.52 2.52 z M134.084 20 l-0.72 -4.94 l-2.02 0 l-0.66 4.94 l-1.92 0 l2.16 -14.3 l2.58 0 l2.5 14.3 l-1.92 0 z M131.604 13.16 l1.48 0 l-0.76 -5.2 z M151.66450000000003 5.68 l3.34 0 l0 14.28 l-1.88 0 l0 -11.3 l-1.78 11.34 l-0.74 0 l-0.18 -0.04 l-0.16 0.04 l-0.74 0 l-1.76 -11.34 l0 11.3 l-1.9 0 l0 -14.28 l3.36 0 l1.22 8.08 z M169.84500000000003 12.46 l-2.76 0 l0 5.64 l2.78 0 l0 1.9 l-4.68 0 l0 -14.28 l4.68 0 l0 1.9 l-2.78 0 l0 2.94 l2.76 0 l0 1.9 z"></path>
    </g>
  </g>
</svg>
`;

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

export function createElements(
  $root: HTMLDivElement,
  columnCount: number,
  metadata: ChartMetadata
) {
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
      <div class="flex">
        ${logo}
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
        <img class="rounded-border-m" src="${metadata.banner}" />
      </b-panel>

      <div class="margin-vertical-s">
        <ul>
          <li>${metadata.title}</li>
          <li>Artist</li>
          <li>${metadata.bpm} BPM</li>
        </ul>
      </div>

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
