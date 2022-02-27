import './style.css'

import { parseChart } from '@packages/chart-parser'
import { drawSvg, Point } from "../"
// import { laser } from './fixtures/laser-1'

const chart = `S000
0000
0000
E00E
,
S000
0000
0000
000E
,
S000
0100
0010
0010
0010
0011
0000
E000
,
S000
0000
1001
0000
1001
000E
0000
0000
`

const parsed = parseChart(
  {
    "title": "165 BPM Example Song",
    "bpm": 165,
    "offset": 1118
  }
, chart)

const COL_WIDTH = 80
const STROKE_WIDTH = 10
const Y_OFFSET = 0
const X_OFFSET = 5

let laser: Point[] = []
const lasers: Array<Point[]> = []
let initMs = 0
const Y_DIVIDER = 1.75

for (const line of parsed.notes) {
  if (line.laserStart) {
    console.log("----Start----")
    console.log('Start', 0, 'initMs', line.ms)
    laser.push([line.columns[0], 0 / Y_DIVIDER])
    initMs = line.ms
  } else if (line.laserEnd) {
    console.log('End', line.ms - initMs)
    laser.push([line.columns[0], (line.ms - initMs) / Y_DIVIDER])
    lasers.push(laser)
    laser = []
  } else {
    for (const c of line.columns) {
      console.log('Next', line.ms - initMs)
      laser.push([c, (line.ms - initMs) / Y_DIVIDER])
    }
  }
}

for (const laser of lasers) {
  const svg = drawSvg(laser, {
    colWidth: COL_WIDTH,
    xOffset: X_OFFSET,
    yOffset: Y_OFFSET,
    strokeWidth: STROKE_WIDTH,
    strokeColor: 'blue',
    fill: 'rgba(255, 0, 0, 0.3)'
  })

  document.body.appendChild(svg)
}
// for
