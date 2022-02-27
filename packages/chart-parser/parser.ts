export interface BaseNote {
  id: string;
  column: number;
  char: string
  ms: number;
}

export interface LaserNote {
  order: number
  column: number
  ms: number
}

export interface Laser {
  id: string;
  notes: LaserNote[]
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

export function parseChart(
  dataJson: Record<string, string>,
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

  const bpm = parseFloat(dataJson.bpm);

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
          ...measure.reduce<BaseNote[]>((_notes, row, idx) => {
            if (row.split("").every(col => col === "0")) {
              return _notes;
            }

            const _newNotes: BaseNote[] = []

            const columns = row.split("")

            for (let i = 0; i < columns.length; ++i) {
              const col = columns[i]
              if (col === "0") {
                continue
              }

              _newNotes.push({
                id: (acc.noteCount + idx + 1).toString(),
                char: col,
                column: i,
                ms: (acc.measureCount * measureMs + q * idx) * 1000,
              });
            }

            return _notes.concat(..._newNotes.sort((x, y) => x.char.localeCompare(y.char)))
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
      offset: parseInt(dataJson.offset, 10),
    },
    notes,
  };
}

export function deriveLasers(notes: BaseNote[]) {
  return notes.reduce<Laser[]>((acc, note) => {
    if (note.char === "1") {
      const laser: Laser = {
        id: (acc.length + 1).toString(),
        notes: [{
          order: 1,
          column: note.column,
          ms: note.ms
        }],
      }
      return [...acc, laser]
    }

    const [currentLaser, ...rest] = [...acc].reverse()

    if (!currentLaser) {
      throw Error('Expected currentLaser to be defined!')
    }

    currentLaser.notes.push({
      order: parseInt(note.char, 10),
      column: note.column,
      ms: note.ms
    })

    return [...rest, currentLaser]
  }, [])
}