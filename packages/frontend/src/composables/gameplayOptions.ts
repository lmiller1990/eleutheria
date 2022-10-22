import {
  CoverParams,
  ModifierManager,
} from "../screens/gameplay/modiferManager";
import { preferencesManager } from "../screens/gameplay/preferences";
import { ScrollDirection } from "../screens/gameplay/types";

const preferences = preferencesManager.getPreferences();
const modifierManager = new ModifierManager();
modifierManager.setMultipler(preferences.speedModifier ?? 1);
modifierManager.setScroll(preferences.scrollDirection ?? "down");
modifierManager.setCover(preferences.cover ?? {});

function handleChangeSpeedMod(val: number) {
  if (val <= 0) {
    return;
  }

  modifierManager.setMultipler(val);
  preferencesManager.updatePreferences({ speedModifier: val });
}

function handleChangeScrollMod(val: ScrollDirection) {
  modifierManager.setScroll(val);
  preferencesManager.updatePreferences({ scrollDirection: val });
}

function handleChangeCoverMod(params: Partial<CoverParams>) {
  modifierManager.setCover(params);
  preferencesManager.updatePreferences({ cover: params });
}

export function useGameplayOptions() {
  return {
    modifierManager,
    handleChangeSpeedMod,
    handleChangeScrollMod,
    handleChangeCoverMod,
  };
}
