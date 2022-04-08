<template>
  <div class="grid grid-columns-repeat-2 grid-col-gap-m padding-m h-100">
    <div class="grid grid-rows-1fr-2fr grid-row-gap-m">
      <SongBanner />
      <div class="grid grid-columns-repeat-2 items-start d rounded-border-s">
        <SongPersonalBest :personalBest="personalBest" />
        <SongInfo :chartSummary="chartSummary" />
      </div>
    </div>

    <div class="grid grid-rows-repeat-3">
      <div />
      <div class="h-100 grid grid-row-gap-s grid-rows-3">
        <SongItem
          class="d"
          v-for="song of songs"
          :key="song.id"
          :id="song.id"
          :song="song"
          :selectedDifficulty="selectedDifficulty"
          :selected="song.order === selectedSong"
        />
      </div>
      <div />
    </div>
  </div>
</template>

<script setup lang="ts">
import "../index.css";
import type {
  BaseSong,
  ChartSummary,
  Difficulty,
  PersonalBest,
} from "@packages/types";
import type { Song } from "../types";
import SongItem from "../components/SongItem.vue";
import SongPersonalBest from "../components/SongPersonalBest.vue";
import SongInfo from "../components/SongInfo.vue";
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import SongBanner from "../components/SongBanner.vue";

const selectedDifficulty = ref<Difficulty>("expert");
const selectedSong = ref(1);

function nextSong() {
  if (selectedSong.value >= songs.value.length - 1) {
    return;
  }
  selectedSong.value++;
}

function prevSong() {
  if (selectedSong.value === 0) {
    return;
  }
  selectedSong.value--;
}

watchEffect(() => console.log(selectedSong.value));

const router = useRouter();

function changeSong(event: KeyboardEvent) {
  if (event.code === "KeyK") {
    prevSong();
  } else if (event.code === "KeyJ") {
    nextSong();
  } else if (event.code === "Enter") {
    const song = songs.value[selectedSong.value];
    router.push({ path: "game", query: { song: song.id } });
  }
}

onMounted(() => {
  window.addEventListener("keydown", changeSong);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", changeSong);
});

const songs = ref<Song[]>([]);

const chartSummary: ChartSummary = {
  tapNotes: 512,
  holdNotes: 18,
  durationSeconds: 198,
  chords: {
    twoNoteCount: 22,
    threeNoteCount: 12,
    fourNoteCount: 9,
    fiveNoteCount: 8,
    sixNoteCount: 1,
  },
};

const personalBest: PersonalBest = {
  percent: 95.5,
  date: "2022-04-06T12:12:11.308Z",
};

async function fetchSongs() {
  const res = await window.fetch("http://localhost:8000/songs");
  const data = (await res.json()) as BaseSong[];
  songs.value = data.map((song, order) => ({ ...song, order }));
}

fetchSongs();
</script>

<style>
@import "@packages/breeze-css/dist/breeze.css";
</style>
