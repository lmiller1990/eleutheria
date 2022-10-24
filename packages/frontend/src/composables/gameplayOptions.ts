import { NoteSkin } from "@packages/shared";
import dedent from "dedent";
import {
  CoverParams,
  ModifierManager,
} from "../screens/gameplay/modiferManager";
import { preferencesManager } from "../screens/gameplay/preferences";
import { ScrollDirection } from "../screens/gameplay/types";

export const defaultNoteSkinFallback = dedent`
  .note {
    height: var(--note-height);
    border-radius: 12px;

    box-sizing: border-box;
    font-size: 2rem;

    border: 1px solid #a8bdc7;
    background: #a8bdc7;
  }

  .note-1,
  .note-4 {
    background: #0a6ed6 !important;
  }
`;

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
