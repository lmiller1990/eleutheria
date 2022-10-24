import { NoteSkin } from "@packages/shared";
import {
  CoverParams,
  defaultNoteSkinFallback,
  ModifierManager,
} from "../screens/gameplay/modiferManager";
import { preferencesManager } from "../screens/gameplay/preferences";
import { ScrollDirection } from "../screens/gameplay/types";

const preferences = preferencesManager.getPreferences();
const modifierManager = new ModifierManager();
modifierManager.setMultipler(preferences.speedModifier ?? 1);
modifierManager.setScroll(preferences.scrollDirection ?? "down");
modifierManager.setCover(preferences.cover ?? {});
modifierManager.setNoteSkin(
  preferences.noteSkin ?? { name: "fallback", css: defaultNoteSkinFallback }
);

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

function handleChangeCoverMod({ style, ...params }: Partial<CoverParams>) {
  modifierManager.setCover(params);
  preferencesManager.updatePreferences({ cover: params });
  console.log(params);
}

function handleChangeNoteSkin(noteSkin: NoteSkin) {
  modifierManager.setNoteSkin(noteSkin);
  preferencesManager.updatePreferences({ noteSkin });
}

export function useGameplayOptions() {
  return {
    modifierManager,
    handleChangeSpeedMod,
    handleChangeScrollMod,
    handleChangeCoverMod,
    handleChangeNoteSkin,
  };
}
