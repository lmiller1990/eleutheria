<template>
  <template v-if="songsStore.songs.length">
    <SongWheelItem :songTitle="`${selectedSong.order}: ${selectedSong.title}`" id="focused-song" />
    <div class="absolute" :style="wheelStyle" id="wheel">
      <div class="relative">
        <SongItemCompact
          v-for="song in songsStore.songs"
          :order="song.order"
          class="absolute"
          :style="getSongStyle(song.order)"
          :key="song.title"
          :id="song.id"
          :songTitle="song.title"
        />
      </div>
    </div>
  </template>
  <template v-else> Loading... </template>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import SongItemCompact from "../components/SongItemCompact.vue";
import SongWheelItem from "../components/SongWheelItem.vue";
import { useSongsStore } from "../stores/songs";
import "../index.css";

const scrollSpeed = "0.1s";

const songsStore = useSongsStore();

function getSongStyle(n: number) {
  const spacing = 60;
  const left = 12 * n;

  let top = 84 * n;

  if (n < focused.value) {
    top = top - spacing;
  }

  if (n > focused.value) {
    top = top + spacing;
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
}

const wheelStyle = computed(() => {
  const top = offset.value * 84;
  const left = offset.value * 12;
  return {
    top: `${top}px`,
    left: `${left}px`,
  };
});

const offset = ref(0);

const selectedSong = computed(() => {
  const belowZeroOrder = songsStore.songs.reduce((acc, curr) => curr.order < 0 ? acc + 1 : acc, 0)
  const song = songsStore.songs[focused.value + belowZeroOrder];
  if (!song) {
    throw Error(`Tried accessing song at index ${focused.value} but was null.`);
  }
  return song;
});

const focused = computed(() => 4 - offset.value);

let nextIndex = 0;
let prevIndex = 2;

function nextSong() {
  offset.value--;

  let order = songsStore.songs.at(-1)!.order + 1;
  const next = songsStore.originalSongs[nextIndex]!
  if (nextIndex === songsStore.originalSongs.length - 1) {
    nextIndex = 0
  } else {
    nextIndex++
  }

  songsStore.setSongs([
    ...songsStore.songs,
    { ...next, id: order.toString(), order },
  ]);
}

watchEffect(() => {
  // console.log(focused.value, songsStore.songs.map(x => x.order).join(" "), offset.value)
})

function prevSong() {
  offset.value++;

  let order = songsStore.songs.at(0)!.order - 1;
  // console.log(songsStore.songs.at(0)!.order, order)
  const next = songsStore.originalSongs[prevIndex]!
  if (prevIndex === 0) {
    prevIndex = songsStore.originalSongs.length - 1
  } else {
    prevIndex--
  }
  songsStore.setSongs([
    { ...next, id: order.toString(), order },
    ...songsStore.songs,
  ]);
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
    // const song = songsStore.songs[focusSongIndex];
    // router.push({
    //   path: "game",
    //   query: {
    //     song: song.id,
    //     difficulty: songsStore.selectedChart?.difficulty,
    //   },
    // });
  }
}

const handleChangeSong = changeSong;

onMounted(() => {
  window.addEventListener("keydown", handleChangeSong);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleChangeSong);
});

songsStore.fetchSongs();
</script>

<style lang="scss">
@import "../shared.scss";

.hidden {
  visibility: hidden;
}

#wheel {
  transition: top v-bind(scrollSpeed) linear, left v-bind(scrollSpeed) linear;
}

#red {
  position: absolute;
  border: 2px solid red;
  width: 300px;
  height: 75px;
  top: 334px;
  left: 80px;
}

#focused-song {
  position: absolute;
  top: 275px;
  left: 40px;
  z-index: 10;
}
</style>
