<template>
  <NonGameplayScreen screenTitle="Evaluation">
    <div class="flex justify-center h-100">
      <div class="wrapper h-100 max-1024 flex items-center">
        <div class="vanity">
          <ScoreBadge :percent="summaryStore.summary?.percent ?? ''" rank="A" />
        </div>

        <div class="lhs-col h-100">
          <SongTile
            :selected="false"
            :imgSrc="thumbails[0]"
            :songTitle="selectedSong.title"
          />

          <DifficultyItem :difficulty="difficulty" />

          <SongInfoPanel :data="scoreData" />
        </div>
      </div>
    </div>
  </NonGameplayScreen>
  <!--
    <span class="ascii-icon font-1rem">▶</span>
    Next Song
    <span class="ascii-icon font-2rem">⟲</span>
    Play Again
  -->
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useSummaryStore } from "../../stores/summary";
import { thumbails } from "../../thumbnails";
import { windowsWithMiss } from "../gameplay/gameConfig";
import { useSongsStore } from "../../stores/songs";
import NonGameplayScreen from "../../components/NonGameplayScreen/NonGameplayScreen.vue";
import SongTile from "../../components/SongTile";
import { computed } from "vue";
import DifficultyItem from "../../components/DifficultyItem.vue";
import SongInfoPanel, { TableCell } from "../../components/SongInfoPanel";
import ScoreBadge from "../../components/ScoreBadge";

const summaryStore = useSummaryStore();
const songsStore = useSongsStore();
const router = useRouter();

const scoreData = computed<TableCell[]>(() => {
  return windowsWithMiss.map<TableCell>((title) => ({
    title,
    content: summaryStore.summary?.timing?.[title]?.count ?? "-",
  }));
});

const selectedSong = computed(() => {
  if (!songsStore.selectedSong) {
    throw Error("Could not get selectedSong");
  }
  return songsStore.selectedSong;
});

const difficulty = computed(() => {
  if (!songsStore.selectedChart) {
    throw Error("Could not get selectedChart");
  }
  return {
    name: songsStore.selectedChart.difficulty,
    level: songsStore.selectedChart.level,
  };
});

if (!summaryStore.summary) {
  router.push("/");
}

// function goNext() {
//   router.push("/");
// }
</script>

<style scoped lang="scss">
@import "../../shared.scss";

.wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 50px;
}

.max-512 {
  // max-width: 512px;
}

#screen-summary {
  font-family: "Comfortaa", cursive;
}

.ascii-icon {
  line-height: 0;
  height: 100%;
  padding-bottom: 5px;
  padding-right: 5px;
}

.lhs-col {
  display: grid;
  row-gap: 10px;
  grid-template-rows: auto 56px max-content;
  max-height: 512px;
}
</style>
