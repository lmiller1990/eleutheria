const validPreferences = ["speedModifier"] as const;

type Preferences<T extends typeof validPreferences[number]> = Record<T, any>;

type ValidPreferences = Preferences<typeof validPreferences[number]>;

const PREFERENCES_KEY = "rhythm";

function getPreferences() {
  const existingPrefs = window.localStorage.getItem(PREFERENCES_KEY) ?? "{}";

  return JSON.parse(existingPrefs) as ValidPreferences;
}

function updatePreferences(preferences: Partial<ValidPreferences>) {
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
    existingPrefs[p] = val;
  }

  window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(existingPrefs));
}

export const preferencesManager = { getPreferences, updatePreferences };
