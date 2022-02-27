import "./style.css";

import { parseChart, deriveLasers } from "@packages/chart-parser";
import { drawSvg, Point } from "../";

const chart = `1000
0000
0000
3002
,
1000
0000
0000
0002
,
1000
0200
0030
0000
0000
0045
0000
6000
,
1000
0000
3002
0000
4005
0006
0000
0000
`;

const parsed = parseChart(
  {
    title: "165 BPM Example Song",
    bpm: 165,
    offset: 1118,
  },
  chart
);

const lasers = deriveLasers(parsed.notes);

const COL_WIDTH = 80;
const STROKE_WIDTH = 10;
const Y_OFFSET = 0;
const X_OFFSET = 5;

let laser: Point[] = [];
let initMs = 0;
const Y_DIVIDER = 2;

// for (const notes of parsed.notes) {
//   if (line.laserStart) {
//     console.log("----Start----")
//     console.log('Start', 0, 'initMs', line.ms)
//     laser.push([line.columns[0], 0 / Y_DIVIDER])
//     initMs = line.ms
//   } else if (line.laserEnd) {
//     console.log('End', line.ms - initMs)
//     laser.push([line.columns[0], (line.ms - initMs) / Y_DIVIDER])
//     lasers.push(laser)
//     laser = []
//   } else {
//     for (const c of line.columns) {
//       console.log('Next', line.ms - initMs)
//       laser.push([c, (line.ms - initMs) / Y_DIVIDER])
//     }
//   }
// }

for (const laser of lasers) {
  const points: Point[] = [];

  let initMs: number = 0;

  for (let i = 0; i < laser.notes.length; i++) {
    const note = laser.notes[i];
    if (i === 0) {
      points.push([note.column, initMs]);
      initMs = note.ms;
    } else {
      points.push([note.column, (note.ms - initMs) / Y_DIVIDER]);
    }
  }

  const svg = drawSvg(points, {
    colWidth: COL_WIDTH,
    xOffset: X_OFFSET,
    yOffset: Y_OFFSET,
    strokeWidth: STROKE_WIDTH,
    strokeColor: "blue",
    fill: "rgba(255, 0, 0, 0.3)",
  });

  document.body.appendChild(svg);
}
// for
