<template>
  <div id="screen-summary" class="flex items-center flex-col h-100">
    <div class="flex flex-col items-center justify-center h-100">
      <div class="flex space-between w-100 items-center">
        <div>
          <!-- placeholder -->
        </div>
        <div class="font-3rem">{{ songsStore.selectedSong?.title }}</div>
        <div
          class="h-30px w-30px flex items-center justify-center rounded-border-s padding-4px"
          :class="difficultyClass"
        >
          <span>{{ songsStore.selectedChart?.level }}</span>
        </div>
      </div>

      <div class="flex items-center w-100 margin-vertical-l">
        <div id="vanity-score" class="flex flex-col items-center">
          <div class="font-5rem">{{ summaryStore.summary?.percent }}%</div>
          <div
            v-for="achievement of summaryStore.summary?.achievements"
            :key="achievement"
            class="font-1rem"
          >
            {{ achievement }}
          </div>
        </div>

        <Panel class="margin-right-0px">
          <table class="w-25rem font-2rem">
            <div
              v-for="win of [...windows, 'miss']"
              :key="win"
              class="flex space-between"
            >
              <div class="upcase" :class="`timing-${win}`">{{ win }}</div>
              <div>{{ data(win).count }}</div>
            </div>
          </table>
        </Panel>
      </div>

      <div class="flex align-center">
        <!-- <button @click="replay">
          <Panel class="flex items-center">
            <span class="ascii-icon font-2rem">⟲</span>
            Play Again
          </Panel>
        </button> -->

        <button @click="goNext">
          <Panel>
            <span class="ascii-icon font-1rem">▶</span>
            Next Song
          </Panel>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useSummaryStore } from "../../stores/summary";
import Panel from "../../components/Panel.vue";
import { difficulties } from "../../shared";
import { windows } from "../gameplay/config";
import { useSongsStore } from "../../stores/songs";

const summaryStore = useSummaryStore();
const songsStore = useSongsStore();

const difficultyClass = songsStore.selectedChart
  ? difficulties[songsStore.selectedChart.difficulty]
  : undefined;

function data(win: string) {
  const d = summaryStore.summary?.timing?.[win];

  if (!d) {
    throw Error(`Could not find data for ${win} in summary`);
  }

  return d;
}

if (!summaryStore.summary) {
  throw Error(`Summary not found for song!`);
}

const router = useRouter();

function goNext() {
  router.push("/");
}
</script>

<style scoped lang="scss">
@import "../../shared.scss";

#screen-summary {
  font-family: "Comfortaa", cursive;
  background: $pattern-bg;
}

.ascii-icon {
  line-height: 0;
  height: 100%;
  padding-bottom: 5px;
  padding-right: 5px;
}
</style>
