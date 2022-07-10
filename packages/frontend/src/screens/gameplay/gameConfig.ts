import type { EngineConfiguration } from "@packages/engine";

export const timingWindows = [
  {
    name: "absolute",
    windowMs: 25,
    weight: 2,
  },
  {
    name: "perfect",
    windowMs: 50,
    weight: 1,
  },
  // {
  //   name: "great",
  //   windowMs: 100,
  //   weight: 1,
  // },
] as const;

export const windows = timingWindows.map((x) => x.name);
export const windowsWithMiss = [...windows, "miss"] as const;

export const NOTE_WIDTH = parseInt(
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--note-width"),
  10
);

export const MULTIPLIER = 1.5;
export const PADDING_MS = 2000;

export const engineConfiguration: EngineConfiguration = {
  maxHitWindow: 50,
  timingWindows,
};

export const codeColumnMap = new Map<string, number>([
  ["KeyS", 0],
  ["KeyD", 1],
  ["KeyF", 2],
  ["KeyJ", 3],
  ["KeyK", 4],
  ["KeyL", 5],
]);
