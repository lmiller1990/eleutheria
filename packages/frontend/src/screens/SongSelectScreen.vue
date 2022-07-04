<template>
  <div class="flex flex-col outer w-100 items-center">
    <nav class="screen-name w-100 text-white flex justify-center">
      <div class="max-1024 screen-title w-100 flex flex-col justify-center">
        Select Song
      </div>
    </nav>
    <div class="wrapper max-1024 h-100">
      <div class="tiles flex items-center justify-center">
        <SongTile
          v-for="(song, idx) of songsStore.songs"
          :key="song.id"
          :songTitle="song.title"
          class="h-100"
          :imgSrc="thumbails[idx]"
          :selected="song.id === songsStore.selectedSongId"
          @selected="handleSelected(song.id)"
        />
      </div>

      <div class="info-col">
        <DifficultyPanel
          :difficulties="difficulties"
          :selectedIndex="selectedChartIndex"
          @selected="(idx) => songsStore.setSelectedChartIdx(idx)"
        />

        <SongInfoPanel
          class="w-100 song-panel"
          :class="chartDifficulty"
          :data="tableData"
          :highlightColor="highlightColor"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SongTile from "../components/SongTile";
import SongInfoPanel from "../components/SongInfoPanel";
import DifficultyPanel from "../components/DifficultyPanel.vue";
import { thumbails } from "../thumbnails";
import { useRouter } from "vue-router";
import { useSongsStore } from "../stores/songs";
import { SongDifficulty } from "../types";
import { ChartSummary } from "@packages/types/src";
import { chartInfo } from "@packages/chart-parser";
import { colors } from "../shared";
import { TableCell } from "../components/SongInfoPanel/types";

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

const selectedChartIndex = computed(() => {
  if (songsStore.selectedChartIdx === undefined || !songsStore.selectedSongId) {
    return undefined;
  }

  return songsStore.selectedChartIdx;
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
      content: "99.50",
    },
  ];
});

const router = useRouter();

function handleSelected(songId: string) {
  if (songsStore.selectedSongId === songId) {
    // they already clicked it once
    // time to play!

    if (!chartDifficulty.value) {
      throw Error(`No difficulty was selected. This should be impossible`);
    }

    router.push({
      path: "game",
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

<style lang="scss">
@import "../shared.scss";
@import "../index.css";
@import "../../../breeze-css/dist/breeze.css";

#app {
  background: #828282;
}
</style>

<style lang="scss" scoped>
.max-1024 {
  max-width: 1024px;
  padding: 0 40px;
}

.wrapper {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  width: 100%;
  column-gap: 80px;
  padding: 40px;
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

.outer {
  margin: 25px 0;
}

.screen-name {
  background: #373737;
}

.screen-title {
  text-align: right;
  height: 54px;
  font-size: 2rem;
  text-transform: uppercase;
  font-weight: bold;
}
</style>
