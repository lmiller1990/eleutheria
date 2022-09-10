<template>
  <NonGameplayScreen screenTitle="Select Song">
    <div class="flex justify-end mb-4">
      <Username />
    </div>
    <div class="wrapper max-w-screen-lg h-full">
      <div class="tiles flex items-center justify-center">
        <SongTile
          v-for="(song, idx) of songsStore.songs"
          :key="song.id"
          :songTitle="song.title"
          class="h-full"
          :imgSrc="thumbails[idx]"
          :selected="song.id === songsStore.selectedSongId"
          @selected="handleSelected(song.id)"
        />
      </div>

      <div class="info-col">
        <DifficultyPanel
          :difficulties="difficulties"
          :selectedIndex="songsStore.selectedChartIdx"
          @selected="(idx) => songsStore.setSelectedChartIdx(idx)"
        />

        <SongInfoPanel
          class="w-full song-panel"
          :class="chartDifficulty"
          :data="tableData"
          :highlightColor="highlightColor"
        />
      </div>
    </div>
  </NonGameplayScreen>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import SongTile from "../../components/SongTile";
import SongInfoPanel from "../../components/SongInfoPanel";
import DifficultyPanel from "../../components/DifficultyPanel.vue";
import { thumbails } from "../../thumbnails";
import { useRouter } from "vue-router";
import { useSongsStore } from "../../stores/songs";
import { SongDifficulty } from "../../types";
import type { ChartSummary } from "@packages/types";
import { chartInfo } from "@packages/chart-parser";
import { colors } from "../../shared";
import { TableCell } from "../../components/SongInfoPanel/types";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import { useHeldKeys } from "../../utils/useHeldKeys";
import { useModal } from "../../composables/modal";
import Username from "./Username.vue";

function handleSettings () {
  const modal = useModal()
  modal.showModal('signUp')
}

function handleKeyDown(event: KeyboardEvent) {
  if (!songsStore.selectedSongId || songsStore.selectedChartIdx === undefined) {
    return;
  }

  if (event.code === "Enter") {
    handleSelected(songsStore.selectedSongId);
  }

  if (event.code === "KeyJ" && songsStore.selectedChartIdx < 2) {
    songsStore.setSelectedChartIdx(songsStore.selectedChartIdx + 1);
  }

  if (event.code === "KeyK" && songsStore.selectedChartIdx > 0) {
    songsStore.setSelectedChartIdx(songsStore.selectedChartIdx - 1);
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

const songsStore = useSongsStore();

const chartDifficulty = computed(() => {
  return songsStore.selectedChart?.difficulty ?? "";
});

const highlightColor = computed(() => {
  return colors[chartDifficulty.value] ?? "yellow";
});

const difficulties = computed<SongDifficulty[]>(() => {
  if (!songsStore.selectedSong) {
    return [];
  }

  return songsStore.selectedSong.charts.map((chart) => {
    return {
      name: chart.difficulty,
      level: chart.level,
    };
  });
});

const chartSummary = computed<ChartSummary | undefined>(() => {
  if (!songsStore.selectedChart) {
    return;
  }

  return chartInfo(
    songsStore.selectedChart.parsedTapNoteChart,
    songsStore.selectedChart.parsedHoldNoteChart
  );
});

const tableData = computed<TableCell[]>(() => {
  return [
    {
      title: "Notes",
      content: chartSummary.value?.totalNotes,
    },
    {
      title: "Duration",
      content: songsStore.selectedSong?.duration,
    },
    {
      title: "BPM",
      content: songsStore.selectedSong?.bpm,
    },
    {
      title: "Best",
      content: "99.50%",
    },
  ];
});

const router = useRouter();

const heldKeys = useHeldKeys();

function handleSelected(songId: string) {
  if (songsStore.selectedSongId === songId) {
    // they already clicked it once
    // time to play!

    if (!chartDifficulty.value) {
      throw Error(`No difficulty was selected. This should be impossible`);
    }

    const route = heldKeys.value.has("KeyE") ? "editor" : "game";
    router.push({
      path: route,
      query: {
        song: songId,
        difficulty: chartDifficulty.value,
      },
    });
  } else {
    songsStore.setSelectedSongId(songId);
  }
}

// function durationToNum(str: string) {
//   const match = /(\d+).*/.exec(str);
//   if (!match?.[1]) {
//     throw Error(`Could not convert ${str} to number`);
//   }
//   return parseInt(match[1], 10);
// }

songsStore.fetchSongs();
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  width: 100%;
  column-gap: 80px;
}

.info-col {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.song-panel {
  margin-top: 20px;
}

.tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 1fr);
  row-gap: 50px;
  column-gap: 50px;
}

.max-1024 {
  max-width: 1024px;
}
</style>
