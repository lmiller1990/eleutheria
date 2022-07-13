<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import type { GameplayProps } from "./types";
import ModifierPanel from "../../../../components/ModifierPanel";
import InfoPanel from "../../../../components/InfoPanel";
import SongInfoPanel, { TableCell } from "../../../../components/SongInfoPanel";
import { useSongsStore } from "../../../../stores/songs";
import { windowsWithMiss } from "../../gameConfig";
import { colors } from "../../../../shared";
import type { GameAPI, Summary } from "@packages/engine";
import { injectNoteSkin } from "../../../../plugins/injectGlobalCssVars";

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

let game: GameAPI | undefined;

onMounted(async () => {
  if (!root.value) {
    return;
  }

  const { start } = await import("../../gameplay");

  game = await start(
    root.value,
    {
      ...props.startGameArgs,
      updateSummary,
    },
    props.__testingDoNotStartSong
  );
});

onUnmounted(() => {
  // stop the game - teardown event manager, stop audio, etc.
  game?.stop();
});
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
                :currentSpeed="1"
                :notes="startGameArgs.noteSkinData"
                @changeNoteSkin="injectNoteSkin"
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

.modifier-wrapper {
  margin: 0 30px;
}
</style>
