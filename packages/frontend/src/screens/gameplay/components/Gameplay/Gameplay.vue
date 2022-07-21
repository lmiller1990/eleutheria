<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import type { GameplayProps } from "./types";
import ModifierPanel, {
  ModCoverParams,
} from "../../../../components/ModifierPanel";
import InfoPanel from "../../../../components/InfoPanel";
import SongInfoPanel, { TableCell } from "../../../../components/SongInfoPanel";
import { useSongsStore } from "../../../../stores/songs";
import { windowsWithMiss } from "../../gameConfig";
import { colors } from "../../../../shared";
import type { Game, Summary } from "@packages/engine";
import { injectNoteSkin } from "../../../../plugins/injectGlobalCssVars";
import { useRouter } from "vue-router";
import { useEventListener } from "../../../../utils/useEventListener";
import { ScrollDirection } from "../../types";
import { preferencesManager } from "../../preferences";
import { ModifierManager } from "../../modiferManager";

const props = defineProps<GameplayProps>();

const root = ref<HTMLDivElement>();

const songsStore = useSongsStore();

if (!songsStore.selectedChart || !songsStore.selectedSong) {
  throw Error(
    `Expected selectedChart and selectedSong to exist in songsStore. This should be impossible.`
  );
}

const selectedChart = songsStore.selectedChart;
const selectedSong = songsStore.selectedSong;
const highlightColor = colors[selectedChart.difficulty] ?? "yellow";

const defaultNoteSkin = props.startGameArgs.noteSkinData.find(
  (x) => x.name === "default"
);

if (!defaultNoteSkin) {
  throw Error(`No default note skin found`);
}

injectNoteSkin(defaultNoteSkin);

const timingSummary = reactive<
  Record<typeof windowsWithMiss[number], number> & { percent: string }
>({
  absolute: 0,
  perfect: 0,
  miss: 0,
  percent: "0.00",
});

const scoreData = computed<TableCell[]>(() => {
  return [
    {
      title: "Absolute",
      content: timingSummary.absolute,
    },
    {
      title: "Perfect",
      content: timingSummary.perfect,
    },
    {
      title: "Miss",
      content: timingSummary.miss,
    },
    {
      title: "Score",
      content: `${timingSummary.percent}%`,
    },
  ];
});

function updateSummary(summary: Summary) {
  for (const win of windowsWithMiss) {
    timingSummary[win] = summary.timing[win].count;
  }
  timingSummary.percent = summary.percent;
}

let game: Game | undefined;
const modifierManager = new ModifierManager();

const router = useRouter();

const heldKeys = new Set<string>();

function stop(event: KeyboardEvent) {
  heldKeys.delete(event.code);

  if (event.code === "KeyQ") {
    game?.stop();
    router.push("/");
  }
}

function handleKeydown(event: KeyboardEvent) {
  heldKeys.add(event.code);

  // lower the cover
  if (heldKeys.has("Space") && event.code === "KeyJ") {
    modifierManager.setCover({
      offset: modifierManager.cover.offset + 50,
    });
  }

  // raise the cover
  if (heldKeys.has("Space") && event.code === "KeyK") {
    modifierManager.setCover({
      offset: modifierManager.cover.offset - 50,
    });
  }
}

useEventListener("keyup", stop);
useEventListener("keydown", handleKeydown);

const preferences = preferencesManager.getPreferences();

const currentSpeed = ref(preferences.speedModifier ?? 1);
const currentScroll = ref<ScrollDirection>(preferences.scrollDirection ?? "up");
const currentCover = ref<string>(preferences.cover?.id ?? "default");

onMounted(async () => {
  if (!root.value) {
    return;
  }

  const { create } = await import("../../gameplay");

  const init = await create(
    root.value,
    {
      ...props.startGameArgs,
      modifierManager,
      updateSummary,
    },
    props.__testingDoNotStartSong
  );

  if (!init) {
    // Only occurs during testing. We want a way to render this screen w/o starting gameplay.
    return;
  }

  game = init.game;

  if (preferences.speedModifier) {
    currentSpeed.value = preferences.speedModifier;
    init.game.modifierManager.setMultipler(preferences.speedModifier);
  } else {
    currentSpeed.value = init.game.modifierManager.multiplier;
  }

  if (preferences.scrollDirection) {
    currentScroll.value = preferences.scrollDirection;
    init.game.modifierManager.setScroll(preferences.scrollDirection);
  } else {
    currentScroll.value = init.game.modifierManager.scrollDirection;
  }

  if (preferences.cover) {
    currentCover.value = preferences.cover?.id ?? "default";
    init.game.modifierManager.setCover(preferences.cover);
  } else {
    currentCover.value = "default";
  }

  init.start();
});

function handleChangeScrollMod(val: ScrollDirection) {
  if (!game) {
    return;
  }

  game.modifierManager.setScroll(val);
  preferencesManager.updatePreferences({ scrollDirection: val });
  currentScroll.value = val;
}

function handleChangeCover(val: ModCoverParams) {
  if (!game) {
    return;
  }

  game.modifierManager.setCover(val);
  preferencesManager.updatePreferences({ cover: val });
  currentCover.value = val.id;
}

function handleChangeSpeedMod(val: number) {
  if (!game) {
    return;
  }

  const newMod = game.modifierManager.multiplier + val;

  if (newMod <= 0) {
    return;
  }

  game.modifierManager.setMultipler(newMod);
  preferencesManager.updatePreferences({ speedModifier: newMod });
  currentSpeed.value = newMod;
}
</script>

<template>
  <div class="flex justify-center">
    <div class="max-w-l">
      <div class="gameplay-content">
        <div class="gameplay" v-once>
          <div ref="root" class="max-w-l" v-once />
        </div>

        <div class="stats flex flex-col justify-center">
          <div class="stats-wrapper">
            <div class="modifier-wrapper">
              <ModifierPanel
                :currentSpeed="currentSpeed"
                :currentScroll="currentScroll"
                :notes="startGameArgs.noteSkinData"
                @changeNoteSkin="injectNoteSkin"
                @changeSpeedMod="handleChangeSpeedMod"
                @changeScrollMod="handleChangeScrollMod"
                @changeCover="handleChangeCover"
              />
            </div>
            <div class="info-panels flex">
              <InfoPanel
                panelTitle="Song"
                class="w-100"
                :class="selectedChart.difficulty"
                :highlightColor="highlightColor"
              >
                <div class="flex flex-col">
                  <div>{{ selectedSong.title }}</div>
                  <div>{{ selectedSong.artist }}</div>
                  <div class="empty">Empty</div>
                  <div class="capitalize">
                    {{ selectedChart.difficulty }} Lv {{ selectedChart.level }}
                  </div>
                </div>
              </InfoPanel>

              <SongInfoPanel
                panelTitle="Stats"
                class="w-100"
                :class="selectedChart.difficulty"
                :data="scoreData"
                :highlightColor="highlightColor"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "../../../../index.css";
@import "../../../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../../../shared.scss";

.gameplay-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  column-gap: 40px;
}

.stats-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1.25fr 1fr;
  row-gap: 50px;
}

.info-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
}

// .modifier-wrapper {
//   margin: 0 30px;
// }
</style>
