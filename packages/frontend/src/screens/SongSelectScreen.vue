<template>
  <div class="h-100 w-100 max-w-l">
    <div
      class="grid grid-columns-1fr-2fr grid-column-gap-s padding-m h-100 w-100"
    >
      <div>
        <Panel v-if="chartSummary">
          <SongInfo
            :chartSummary="chartSummary"
            :durationSeconds="selectedSong?.duration"
          />
        </Panel>

        <Panel>
          <SongDifficulty :charts="charts" selected="expert" />
        </Panel>

        <Panel>
          <SongPersonalBest :personalBest="personalBest" />
        </Panel>
      </div>

      <div class="flex relative justify-center">
        <div class="w-100 absolute z-10">
          <SelectSongBanner />
        </div>

        <div class="relative w-100 overflow-hidden">
          <div class="absolute w-100 padding-horizontal-l" id="wheel">
            <TransitionGroup name="items" mode="out-in">
              <SongItem
                class="margin-bottom-1rem"
                :class="{
                  'h-9rem selected': isSelected(song),
                  'not-selected h-5rem': !isSelected(song),
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
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
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
import SelectSongBanner from "../components/SelectSongBanner.vue";
import Panel from "../components/Panel.vue";
import { useSongsStore } from "../stores/songs";
import { chartInfo } from "@packages/chart-parser";
import "../index.css";

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
    prevSong();
  } else if (event.code === "KeyJ") {
    nextSong();
  } else if (event.code === "Enter") {
    const song = songsStore.songs[focusSongIndex];
    router.push({ path: "game", query: { song: song.id } });
  }
}

onMounted(() => {
  const ms = parseFloat(scrollSpeed.replace("s", ""));
  window.addEventListener("keydown", throttle(changeSong, ms * 1000));
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", changeSong);
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

.not-selected {
  margin-left: 20px;
}

.selected {
  margin-left: -20px;
  box-shadow: 0px 0px 10px 5px goldenrod;
}
</style>
