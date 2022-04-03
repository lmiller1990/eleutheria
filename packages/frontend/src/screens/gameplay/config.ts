import { EngineConfiguration } from "@packages/engine";

export const windows = ["perfect", "great"] as const;

export const NOTE_WIDTH = parseInt(
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--note-width"),
  10
);

export const MULTIPLIER = 1; // 1.25;
export const PADDING_MS = 2000;

export const engineConfiguration: EngineConfiguration = {
  maxHitWindow: 75,
  timingWindows: [
    {
      name: windows[0],
      windowMs: 25,
    },
    {
      name: windows[1],
      windowMs: 75,
    },
  ],
};

export const codeColumnMap = new Map<string, number>([
  ["KeyS", 0],
  ["KeyD", 1],
  ["KeyF", 2],
  ["KeyJ", 3],
  ["KeyK", 4],
  ["KeyL", 5],
]);
