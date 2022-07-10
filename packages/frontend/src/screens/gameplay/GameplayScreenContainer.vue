<script lang="ts" setup>
import type { Summary } from "@packages/engine";
import {
  FunctionalComponent,
  h,
  reactive,
  ref,
} from "vue";
import { useRouter } from "vue-router";
import { useSummaryStore } from "../../stores/summary";
import { fetchData, getSongId } from "./fetchData";
import { windowsWithMiss } from "./gameConfig";
import { useSongsStore } from "../../stores/songs";
import "../../style.css";
import Gameplay, { GameplayProps } from "./components/Gameplay";

const router = useRouter();

const SideOverlay: FunctionalComponent = (_, { slots }) => {
  return h(
    "div",
    {
      class: "w-100 side flex align-end justify-center",
    },
    slots
  );
};

// const timingSummary = reactive<
//   Record<typeof windowsWithMiss[number], number> & { percent: string }
// >({
//   absolute: 0,
//   perfect: 0,
//   miss: 0,
//   percent: "0.00",
// });

function updateSummaryPanel(summary: Summary) {
  // for (const win of windowsWithMiss) {
  //   timingSummary[win] = summary.timing[win].count;
  // }
  // timingSummary.percent = summary.percent;
}

// const scoreData = computed<TableCell[]>(() => {
//   return [
//     {
//       title: "Absolute",
//       content: timingSummary.absolute,
//     },
//     {
//       title: "Perfect",
//       content: timingSummary.perfect,
//     },
//     {
//       title: "Miss",
//       content: timingSummary.miss,
//     },
//     {
//       title: "Score",
//       content: `${timingSummary.percent}%`,
//     },
//   ];
// });

function songCompleted(summary: Summary) {
//   const summaryStore = useSummaryStore();
//   summaryStore.setSummary(summary);
//   router.push("/summary");
}

const paramData = getSongId();
const songData = await fetchData(paramData.id);

const startGameArgs: GameplayProps['startGameArgs'] = {
  songData,
  paramData,
  songCompleted,
  gameplayModifiers: {
    scroll: "up",
    speed: 1,
  },
  updateSummaryPanel
}

const songsStore = useSongsStore();
</script>

<template>
  <div id="game-app" v-if="songsStore.selectedChart && songsStore.selectedSong">
    <!-- <SideOverlay id="lhs">
      <InfoPanel panelTitle="Song" class="w-100">
        <div class="flex flex-col">
          <div>{{ songsStore.selectedSong.title }}</div>
          <div>{{ songsStore.selectedSong.artist }}</div>
          <div class="empty">Empty</div>
          <div class="capitalize">
            {{ songsStore.selectedChart.difficulty }} Lv {{ songsStore.selectedChart.level }}
          </div>
        </div>
      </InfoPanel>
    </SideOverlay> -->
    <!-- <div ref="root" class="max-w-l" /> -->
    <Gameplay :startGameArgs="startGameArgs" />

    <!-- <SideOverlay id="rhs">
      <SongInfoPanel panelTitle="Stats" class="w-100" :data="scoreData" />
    </SideOverlay> -->
  </div>
</template>

<style scoped>
.side {
  margin: 40px;
}

.empty {
  visibility: hidden;
}

.capitalize {
  text-transform: capitalize;
}
</style>
