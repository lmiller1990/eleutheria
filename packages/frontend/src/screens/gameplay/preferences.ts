import { NoteSkin } from "@packages/shared";
import { CoverParams } from "./modiferManager";
import { ScrollDirection } from "./types";

const validPreferences = [
  "speedModifier",
  "scrollDirection",
  "cover",
  "noteSkin",
  "selectedSongId",
  "selectedChartIdx",
] as const;

export interface Preferences {
  scrollDirection: ScrollDirection;
  speedModifier: number;
  noteSkin: NoteSkin;
  cover: Partial<CoverParams>;
  selectedSongId: number;
  selectedChartIdx: number;
}

const PREFERENCES_KEY = "rhythm";

function getPreferences() {
  const existingPrefs = window.localStorage.getItem(PREFERENCES_KEY) ?? "{}";

  return JSON.parse(existingPrefs) as Partial<Preferences>;
}

export function mergePreferences(
  existingPreferences: Partial<Preferences>,
  preferences: Partial<Preferences>
) {
  for (const [pref, val] of Object.entries(preferences)) {
    const p = pref as typeof validPreferences[number];

    if (!validPreferences.includes(p)) {
      throw Error(
        `${p} is not a valid key. Valid properties are ${validPreferences.join(
          ","
        )}`
      );
    }

    // Do we need runtime validation?
    if (typeof val === "object") {
      (existingPreferences[p] as object) = {
        ...(existingPreferences[p] as object),
        ...val,
      };
    } else {
      existingPreferences[p] = val as any;
    }
  }

  return existingPreferences;
}

function updatePreferences(preferences: Partial<Preferences>) {
  const existingPrefs = getPreferences();

  const merged = mergePreferences(existingPrefs, preferences);

  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(merged));
}

export const preferencesManager = { getPreferences, updatePreferences };
