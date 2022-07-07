<script lang="ts" setup>
import { useSummaryStore } from "../../stores/summary";
import { windowsWithMiss } from "../gameplay/gameConfig";
import { useSongsStore } from "../../stores/songs";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import PlainPanel from "../../components/PlainPanel";
import { computed } from "vue";
import DifficultyItem from "../../components/DifficultyItem.vue";
import SongInfoPanel, { TableCell } from "../../components/SongInfoPanel";
import ScoreBadge from "../../components/ScoreBadge";
import Triangle from "../../components/Triangle.vue";

const summaryStore = useSummaryStore();
const songsStore = useSongsStore();

const scoreData = computed<TableCell[]>(() => {
  const timing = windowsWithMiss.map<TableCell>((title) => ({
    title,
    content: summaryStore.summary?.timing?.[title]?.count ?? "-",
  }));

  return [
    ...timing,
    {
      title: "Holds",
      content: "25/30",
    },
  ];
});

const difficulty = computed(() => {
  if (!songsStore.selectedChart) {
    return;
  }

  return {
    name: songsStore.selectedChart.difficulty,
    level: songsStore.selectedChart.level,
  };
});
</script>

<template>
  <div
    style="background-image: url('/static/thumb-1.webp')"
    id="song-banner"
  ></div>
  <NonGameplayScreen screenTitle="Evaluation">
    <div class="flex justify-center h-100 w-100">
      <div class="wrapper h-100 max-1024 flex items-center w-100">
        <div class="vanity flex justify-center flex-col items-center">
          <ScoreBadge :percent="summaryStore.summary?.percent ?? ''" rank="A" />
        </div>

        <div class="flex flex-col items-center w-100">
          <div class="lhs-col h-100 w-100">
            <SongInfoPanel :data="scoreData" />
            <DifficultyItem v-if="difficulty" :difficulty="difficulty" />
            <PlainPanel class="w-100 mods-panel h-100">
              <div class="flex">2x upscroll NOTE HERE</div>
            </PlainPanel>

            <RouterLink
              class="button flex justify-center items-center continue-button"
              to="/"
            >
              Continue
              <span class="triangle">
                <Triangle fill="#373737" />
              </span>
            </RouterLink>
          </div>
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

<style>
#app {
  background: none;
}
</style>

<style scoped lang="scss">
@import "../../shared.scss";

.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr; // repeat(2, 1fr);
  column-gap: 50px;
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
  row-gap: 20px;
  grid-template-rows: max-content 56px 56px;
}

.vanity {
  justify-content: center;
  height: 100%;
}

#song-banner {
  position: absolute;
  z-index: -1;

  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
  max-width: calc(100vh * 1.7777);

  top: 0px;
  left: 0px;
  right: 0;
  bottom: 0;
  margin: auto;

  filter: brightness(0.9);
}

.button {
  width: 150px;
  font-size: 1.25rem;
  border-radius: 4px;
  border: none;
  background: #d9d9d9;
  padding: 8px;

  &:hover {
    filter: brightness(1.1);
    cursor: pointer;
    animation: none;
  }
}

.continue-button {
  justify-self: flex-end;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    background: #e9e9e9;
  }

  50% {
    background: #a9a9a9;
  }

  100% {
    background: #e9e9e9;
  }
}

.triangle {
  margin: 0 0 0 10px;
}
</style>
