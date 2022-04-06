<template>
  <div class="flex h-100 padding-m">
    <section class="w-100">
      <div class="flex flex-col justify-center h-100">
        <div class="h-100 margin-s">
          <div class="rounded-border-s h-100">
            <div
              style="background: skyblue"
              class="h-100 rounded-border-s flex items-center justify-center"
            >
              Banner
            </div>
          </div>
        </div>

        <div
          class="flex h-100 margin-s justify-center rounded-border-s"
          style="background: skyblue"
        >
          <div class="margin-horizontal-s">
            <SongInfo :chartSummary="chartSummary" />
          </div>
          <div class="margin-horizontal-s">
            <SongPersonalBest :personalBest="personalBest" />
          </div>
        </div>
      </div>
    </section>

    <section class="w-100">
      <div class="padding-s h-100">
        <div class="h-100 grid grid-row-gap-s">
          <SongItem
            v-for="song of songs"
            :key="song.id"
            :id="song.id"
            :song="song"
            :selectedDifficulty="selectedDifficulty"
            :selected="song.order === selectedSong"
          />
        </div>
      </div>
    </section>
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
.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.flex-col {
  flex-direction: column;
}

.w-100 {
  width: 100%;
}

.h-100 {
  height: 100%;
}

.d {
  border: 1px solid red;
}

.padding-s {
  padding: 12px;
}
.padding-m {
  padding: 36px;
}

.margin-s {
  margin: 12px;
}
.margin-m {
  margin: 36px;
}

.margin-horizontal-s {
  margin: 0 8px 0 8px;
}
.margin-vertical-s {
  margin: 8px 0;
}

.padding-horizontal-s {
  padding: 0 8px 0 8px;
}
.padding-vertical-s {
  padding: 8px 0;
}

.rounded-border-s {
  border-radius: 8px;
}

.flex-grow {
  flex-grow: 1;
}

.grid {
  display: grid;
}
.grid-row-gap-s {
  grid-row-gap: 8px;
}
</style>
