import { EngineConfiguration,
} from "@packages/engine";

export const windows = ["perfect", "great"] as const;

export const NOTE_WIDTH = parseInt(
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--note-width"),
  10
);

export const MULTIPLIER = 1.0;
export const PADDING_MS = 2000;

export const engineConfiguration: EngineConfiguration = {
  maxHitWindow: 100,
  timingWindows: [
    {
      name: windows[0],
      windowMs: 50,
    },
    {
      name: windows[1],
      windowMs: 100,
    },
  ],
};
