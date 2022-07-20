import { CoverParams } from "./modiferManager";
import { ScrollDirection } from "./types";

const validPreferences = ["speedModifier", "scrollDirection", "cover"] as const;

interface Preferences {
  scrollDirection: ScrollDirection;
  speedModifier: number;
  cover: Partial<CoverParams>;
}

const PREFERENCES_KEY = "rhythm";

function getPreferences() {
  const existingPrefs = window.localStorage.getItem(PREFERENCES_KEY) ?? "{}";

  return JSON.parse(existingPrefs) as Partial<Preferences>;
}

function updatePreferences(preferences: Partial<Preferences>) {
  const existingPrefs = getPreferences();

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
    existingPrefs[p] = val as any;
  }

  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(existingPrefs));
}

export const preferencesManager = { getPreferences, updatePreferences };
