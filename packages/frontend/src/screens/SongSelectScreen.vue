<template>
  <div class="wrapper">
    <div class="tiles flex items-center justify-center">
      <SongTile
        v-for="(song, idx) of songsStore.songs"
        class="w-100"
        :key="song.id"
        :songTitle="song.title"
        :selected="song.id === songsStore.selectedSongId"
        :imgSrc="thumbails[idx]"
        @selected="songsStore.setSelectedSongId(song.id)"
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
        personalBest="99.50"
        :duration="songsStore.selectedSong?.duration"
        :bpm="songsStore.selectedSong?.bpm"
        :noteCount="chartSummary?.totalNotes"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SongTile from "../components/SongTile";
import SongInfoPanel from "../components/SongInfoPanel.vue";
import DifficultyPanel from "../components/DifficultyPanel.vue";
import { thumbails } from "../thumbnails";
import { useRouter } from "vue-router";
import { useSongsStore } from "../stores/songs";
import { SongDifficulty } from "../types";
import { ChartSummary } from "@packages/types/src";
import { chartInfo } from "@packages/chart-parser";

const songsStore = useSongsStore();

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

const router = useRouter();

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
.wrapper {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  width: 100%;
  max-width: 1024px;
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
</style>
