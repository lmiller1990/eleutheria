export interface BaseNote {
  id: string;
  columns: number[];
  ms: number;
  laserStart?: boolean
  laserEnd?: boolean
}

export interface ChartMetadata {
  title: string;
  bpm: number;
  offset: number;
}

export interface ParsedChart {
  metadata: ChartMetadata;
  notes: BaseNote[];
}

type Measure = string[];

const validQuantizations = [4, 8, 12, 16] as const;

type ValidQuantization = typeof validQuantizations[number];

function measureQuantizationValid(measure: Measure) {
  if (validQuantizations.includes(measure.length as ValidQuantization)) {
    return true;
  }
  throw Error(`${measure.length} is not a valid quanization`);
}

const tokens = ["S", "E", "1"]

interface DataJsonSchema {
  title: string
  bpm: number
  offset: number
}
export function parseChart(
  dataJson: DataJsonSchema,
  chartRaw: string
): ParsedChart {
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

  const bpm = dataJson.bpm;

  const _4th = 60 / bpm;
  const _8th = _4th / 2;
  const _16th = _8th / 2;
  const measureMs = _4th * 4;

  const qMap = new Map<ValidQuantization, number>([
    [4, _4th],
    [8, _8th],
    [16, _16th],
  ]);

  const getQuantizationMs = (m: Measure) => {
    const q = qMap.get(m.length as ValidQuantization);
    if (!q) {
      throw Error(`${m.length} is not a valid quanization`);
    }
    return q;
  };

  const notes = measures.reduce<{
    notes: BaseNote[];
    measureCount: number;
    noteCount: number;
  }>(
    (acc, measure) => {
      const q = getQuantizationMs(measure);

      return {
        measureCount: acc.measureCount + 1,
        noteCount: acc.noteCount + measure.length,
        notes: [
          ...acc.notes,
          ...measure.reduce<BaseNote[]>((_notes, x, idx) => {
            if (!tokens.some(y => x.includes(y))) {
              return _notes;
            }

            return _notes.concat({
              id: (acc.noteCount + idx + 1).toString(),
              columns: x
                .split("")
                .reduce<number[]>(
                  (acc, col, idx) => (tokens.includes(col) ? [...acc, idx] : acc),
                  []
                ),
              ms: (acc.measureCount * measureMs + q * idx) * 1000,
              laserStart: x.includes("S"),
              laserEnd: x.includes("E"),
            });
          }, []),
        ],
      };
    },
    { notes: [], measureCount: 0, noteCount: 0 }
  ).notes;

  return {
    metadata: {
      title: dataJson.title,
      bpm,
      offset: dataJson.offset,
    },
    notes,
  };
}
