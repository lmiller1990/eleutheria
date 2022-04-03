export interface BaseNote {
  id: string;
  column: number;
  char: string;
  ms: number;
}

export interface ChartMetadata {
  title: string;
  bpm: number;
  offset: number;
}

export interface ParsedTapNoteChart {
  metadata: ChartMetadata;
  tapNotes: BaseNote[];
}

export type HoldNote = BaseNote[];

export interface ParsedHoldNoteChart {
  metadata: ChartMetadata;
  holdNotes: HoldNote[];
}

export type ValidQuantization = typeof validQuantizations[number];

export const validQuantizations = [4, 8, 12, 16] as const;

interface GetQuantization {
  quantization: ValidQuantization;
  measureMs: number;
}

function randomId() {
  const num = () => (Math.random() * 9999).toFixed(0)
  return Array(4).fill('').map(num).join('-')
}

export function getQuantizationMs(
  measure: string[],
  bpm: number
): GetQuantization {
  const _4th = 60 / bpm;
  const _8th = _4th / 2;
  const _16th = _8th / 2;
  const measureMs = _4th * 4;

  const qMap = new Map<ValidQuantization, number>([
    [4, _4th],
    [8, _8th],
    [16, _16th],
  ]);

  const q = qMap.get(measure.length as ValidQuantization);
  if (!q) {
    throw Error(`${measure.length} is not a valid quanization`);
  }
  return {
    quantization: q as ValidQuantization,
    measureMs,
  };
}

type Measure = string[];

function measureQuantizationValid(measure: Measure) {
  if (validQuantizations.includes(measure.length as ValidQuantization)) {
    return true;
  }
  throw Error(`${measure.length} is not a valid quanization`);
}

export function parseChart(
  dataJson: ChartMetadata,
  chartRaw: string
): ParsedTapNoteChart {
  const lines = chartRaw.split("\n").filter((x) => x.trim().length > 0);

  const measures = lines.reduce<{
    measures: Measure[];
    currMeasure: Measure;
  }>(
    (acc, _curr, idx) => {
      const curr = _curr.trim();

      if (curr === "," && measureQuantizationValid(acc.currMeasure)) {
        acc.measures.push(acc.currMeasure);
        acc.currMeasure = [];
        return acc;
      }

      acc.currMeasure.push(curr);

      // end of chart
      if (idx + 1 === lines.length) {
        acc.measures.push(acc.currMeasure);
      }

      return acc;
    },
    { measures: [], currMeasure: [] }
  ).measures;

  const tapNotes = measures.reduce<{
    tapNotes: BaseNote[];
    measureCount: number;
    noteCount: number;
  }>(
    (acc, measure) => {
      const { quantization, measureMs } = getQuantizationMs(
        measure,
        dataJson.bpm
      );

      return {
        measureCount: acc.measureCount + 1,
        noteCount: acc.noteCount + measure.length,
        tapNotes: [
          ...acc.tapNotes,
          ...measure.reduce<BaseNote[]>((_notes, row, idx) => {
            if (row.split("").every((col) => col === "0")) {
              return _notes;
            }

            const _newNotes: BaseNote[] = [];

            const columns = row.split("");

            for (let i = 0; i < columns.length; ++i) {
              const col = columns[i];
              if (col === "0") {
                continue;
              }

              _newNotes.push({
                id: randomId(),
                char: col,
                column: i,
                ms: (acc.measureCount * measureMs + quantization * idx) * 1000,
              });
            }

            return _notes.concat(
              ..._newNotes.sort((x, y) => x.char.localeCompare(y.char))
            );
          }, []),
        ],
      };
    },
    { tapNotes: [], measureCount: 0, noteCount: 0 }
  ).tapNotes;

  return {
    metadata: {
      title: dataJson.title,
      bpm: dataJson.bpm,
      offset: dataJson.offset,
    },
    tapNotes,
  };
}

// uses parseChart then derives holds.
export function parseHoldsChart(
  dataJson: ChartMetadata,
  chartRaw: string
): ParsedHoldNoteChart {
  const result = parseChart(dataJson, chartRaw);

  let holds: HoldNote[] = [];
  let hold: HoldNote = [];

  for (const note of result.tapNotes) {
    if (note.char === "1") {
      if (hold.length) {
        // add existing hold to list, start new one
        holds.push(hold);
        hold = [{...note, id: `h${note.id}`}];
      } else {
        // first hold
        hold = [{ ...note, id: `h${note.id}` }];
      }
    } else if (note.char.match(/[2-9]/)) {
      hold.push({ ...note, id: `h${note.id}` });
    }
  }

  // final hold
  if (hold.length) {
    holds.push(hold);
  }

  holds = holds.map((hold) =>
    hold.sort((x, y) => parseInt(x.char, 10) - parseInt(y.char, 10))
  );

  return {
    ...result,
    holdNotes: holds,
  };
}
