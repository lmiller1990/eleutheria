import { EngineConfiguration } from "@packages/engine";

export const windows = ["perfect", "great"] as const;

export const NOTE_WIDTH = parseInt(
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--note-width"),
  10
);

export const MULTIPLIER = 1.25;
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
  ["KeyD", 0],
  ["KeyF", 1],
  ["KeyJ", 2],
  ["KeyK", 3],
]);
