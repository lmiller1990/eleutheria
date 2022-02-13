<template>
  <div class="flex h-full bg-gradient-to-t from-gray-400 to-gray-100">
    <div class="grow">Placeholder</div>
    <div class="flex flex-col justify-center h-full px-4">
      <SongItem
        v-for="song of songs"
        :id="song.id"
        :song="song"
        :selectedDifficulty="selectedDifficulty"
        :selected="song.order === selectedSong"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseSong, Difficulty } from "@packages/types";
import type { Song } from "../types";
import SongItem from "../components/SongItem.vue";
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

async function fetchSongs() {
  const res = await window.fetch("http://localhost:8000/songs");
  const data = (await res.json()) as BaseSong[];
  songs.value = data.map((song, order) => ({ ...song, order }));
}

fetchSongs();
</script>
