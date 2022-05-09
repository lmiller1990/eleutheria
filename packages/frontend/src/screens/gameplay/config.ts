import type { EngineConfiguration } from "@packages/engine";

export const timingWindows = [
  {
    name: "absolute",
    windowMs: 20,
    weight: 3,
  },
  {
    name: "perfect",
    windowMs: 35,
    weight: 2,
  },
  {
    name: "great",
    windowMs: 100,
    weight: 1,
  },
] as const;

export const windows = timingWindows.map((x) => x.name);

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
