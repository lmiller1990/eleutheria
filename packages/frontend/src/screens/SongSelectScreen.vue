<template>
  <div class="h-100 w-100 max-w-l">
    <div
      class="grid grid-columns-1fr-2fr grid-column-gap-s padding-m h-100 w-100"
    >
      <div class="flex flex-col space-between margin-s">
        <div class="menu-title align-center">Select Song</div>
        <div>
          <VerticalPaddedPanel v-if="chartSummary">
            <SongInfo
              :chartSummary="chartSummary"
              :durationSeconds="selectedSong?.duration"
            />
          </VerticalPaddedPanel>

          <VerticalPaddedPanel>
            <SongPersonalBest :personalBest="personalBest" />
          </VerticalPaddedPanel>

          <VerticalPaddedPanel v-if="charts[songsStore.selectedChartIdx]">
            <SongDifficulty
              :charts="charts"
              :selected="songsStore.selectedChartIdx"
            />
          </VerticalPaddedPanel>
        </div>
      </div>

      <div class="flex relative justify-center">
        <div class="relative w-100 overflow-hidden">
          <div class="absolute w-100 padding-horizontal-l" id="wheel">
            <TransitionGroup name="items" mode="out-in">
              <SongItem
                class="margin-bottom-1rem"
                :class="{
                  'h-9rem selected': isSelected(song),
                  'h-5rem': !isSelected(song),
                }"
                v-for="song of songsStore.songs"
                :key="song.key"
                :id="song.id"
                :song="song"
                :selectedDifficulty="selectedDifficulty"
              />
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  FunctionalComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watchEffect,
} from "vue";
import { useRouter } from "vue-router";
import { throttle } from "lodash";
import type {
  ChartSummary,
  Difficulty,
  PersonalBest,
} from "@packages/types/src";
import type { Song } from "../types";
import SongItem from "../components/SongItem.vue";
import SongPersonalBest from "../components/SongPersonalBest.vue";
import SongDifficulty from "../components/SongDifficulty.vue";
import SongInfo from "../components/SongInfo.vue";
import Panel from "../components/Panel.vue";
import { useSongsStore } from "../stores/songs";
import { chartInfo } from "@packages/chart-parser";
import "../index.css";

const VerticalPaddedPanel: FunctionalComponent = (_props, _ctx) =>
  h(Panel, { class: "margin-vertical-s" }, _ctx.slots["default"]);

const focusSongIndex = 3;
const scrollSpeed = "0.1s";

const selectedDifficulty = ref<Difficulty>("expert");
const songsStore = useSongsStore();

function isSelected(song: Song) {
  return songsStore.songs.indexOf(song) === focusSongIndex;
}

const selectedSong = computed(() => {
  return songsStore.songs.at(focusSongIndex);
});

watchEffect(() => {
  if (!selectedSong.value) {
    return;
  }
  songsStore.setSelectedSongId(selectedSong.value.id);
});

function nextSong() {
  let [first, ...rest] = songsStore.songs;
  songsStore.setSongs([...rest, first]);
}

function prevSong() {
  const last = songsStore.songs.at(-1)!;
  songsStore.setSongs([last, ...songsStore.songs.slice(0, -1)]);
}

const router = useRouter();

function changeSong(event: KeyboardEvent) {
  if (event.code === "KeyK") {
    songsStore.setSelectedChartIdx(0);
    prevSong();
  } else if (event.code === "KeyJ") {
    songsStore.setSelectedChartIdx(0);
    nextSong();
  } else if (event.code === "KeyH") {
    if (songsStore.selectedChartIdx > 0) {
      songsStore.setSelectedChartIdx(songsStore.selectedChartIdx - 1);
    }
  } else if (event.code === "KeyL") {
    if (!selectedSong.value) {
      return;
    }

    if (songsStore.selectedChartIdx < selectedSong.value.charts.length - 1) {
      songsStore.setSelectedChartIdx(songsStore.selectedChartIdx + 1);
    }
  } else if (event.code === "Enter") {
    const song = songsStore.songs[focusSongIndex];
    router.push({
      path: "game",
      query: {
        song: song.id,
        difficulty: songsStore.selectedChart?.difficulty,
      },
    });
  }
}

const ms = parseFloat(scrollSpeed.replace("s", ""));
const handleChangeSong = throttle(changeSong, ms * 1000);

onMounted(() => {
  window.addEventListener("keydown", handleChangeSong);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleChangeSong);
});

const chartSummary = computed<ChartSummary | undefined>(() => {
  if (!selectedSong.value || !selectedSong.value.charts.length) {
    return;
  }

  return chartInfo(
    selectedSong.value.charts[0].parsedTapNoteChart,
    selectedSong.value.charts[0].parsedHoldNoteChart
  );
});

const personalBest: PersonalBest = {
  percent: 95.5,
  date: "2022-04-06T12:12:11.308Z",
};

const charts = computed(() => selectedSong.value?.charts ?? []);

songsStore.fetchSongs();
</script>

<style lang="scss">
@import "../shared.scss";

#app,
[data-cy-root] {
  background: $pattern-bg;
}

.items-move {
  transition: transform v-bind(scrollSpeed);
}

#wheel {
  top: calc(16px * 1);
  color: black;
}

@keyframes pulsate {
  0% {
    box-shadow: 0px 0px 10px 3px goldenrod;
  }

  100% {
    box-shadow: 0px 0px 10px 8px goldenrod;
  }
}

.selected {
  animation: pulsate 0.5s ease-in-out infinite alternate;
}
</style>
