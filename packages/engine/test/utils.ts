import { GameChart, World } from "..";

export function createWorld(
  chart: Partial<GameChart> = { tapNotes: new Map() },
  overrides: Partial<World> = {}
): World {
  return {
    startTime: 0,
    t0: 0,
    time: 0,
    combo: 0,
    inputs: [],
    // @ts-ignore - TODO: figure this out.
    audioContext: undefined,
    // @ts-ignore - TODO: figure this out.
    source: undefined,
    ...overrides,
    chart: {
      tapNotes: chart.tapNotes || new Map(),
      holdNotes: chart.holdNotes || new Map(),
    },
  };
}
