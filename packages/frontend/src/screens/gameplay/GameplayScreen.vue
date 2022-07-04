<script lang="ts" setup>
import type { Summary } from "@packages/engine";
import { computed, FunctionalComponent, h, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSummaryStore } from "../../stores/summary";
import InfoPanel from "../../components/InfoPanel";
import SongInfoPanel from "../../components/SongInfoPanel/SongInfoPanel.vue";
import { TableCell } from "../../components/SongInfoPanel/types";
import "../../style.css";
import { useSongsStore } from "../../stores/songs";

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

const scoreData = computed<TableCell[]>(() => {
  return [
    {
      title: "Absolute",
      content: 0,
    },
    {
      title: "Perfect",
      content: 0,
    },
    {
      title: "Miss",
      content: 0,
    },
    {
      title: "Score",
      content: "99.50%",
    },
  ];
});

function songCompleted(summary: Summary) {
  const summaryStore = useSummaryStore();
  summaryStore.setSummary(summary);
  router.push("/summary");
}

const root = ref<HTMLDivElement>();

onMounted(async () => {
  if (!root.value) {
    throw Error("Could not find root node for game");
  }

  const { start } = await import("./gameplay");

  start(root.value, songCompleted, {
    scroll: "up",
    speed: 1,
  });
});

const songsStore = useSongsStore();

const selectedSong = computed(() => {
  if (!songsStore.selectedSong) {
    throw Error(`songsStore.selectedSong not set!`);
  }
  return songsStore.selectedSong;
});

const selectedChart = computed(() => {
  if (!songsStore.selectedChart) {
    throw Error(`songsStore.selectedChart not set!`);
  }
  return songsStore.selectedChart;
});
</script>

<template>
  <div id="game-app">
    <SideOverlay id="lhs">
      <InfoPanel panelTitle="Song" class="w-100">
        <div class="flex flex-col">
          <div>{{ selectedSong.title }}</div>
          <div>{{ selectedSong.artist }}</div>
          <div class="empty">Empty</div>
          <div class="capitalize">{{ selectedChart.difficulty }} Lv {{ selectedChart.level }}</div>
        </div>
      </InfoPanel>
    </SideOverlay>

    <div ref="root" class="max-w-l" />

    <SideOverlay id="rhs">
      <SongInfoPanel panelTitle="Stats" class="w-100" :data="scoreData" />
    </SideOverlay>
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
