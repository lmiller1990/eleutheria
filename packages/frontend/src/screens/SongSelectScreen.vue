<template>
  <div class="wrapper">
    <div class="tiles-wrapper flex items-center content-center">
      <div class="song-tiles">
        <SongTile
          v-for="(song, idx) of songsStore.songs"
          class="w-100"
          :key="song.id"
          :songTitle="song.title"
          :selected="song.id === songsStore.selectedSongId"
          :imgSrc="thumbails[idx]"
          @click="songsStore.setSelectedSongId(song.id)"
        />
      </div>
    </div>

    <div class="info-col">
      <DifficultyPanel 
        :difficulties="difficulties"
        :selectedIndex="selectedChartIndex"
        @selected="idx => songsStore.setSelectedChartIdx(idx)"
      />

      <SongInfoPanel 
        class="w-100 song-panel"
        personalBest="99.50"
        duration="1:50"
        :bpm="155"
        :noteCount="1100"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watchEffect } from "vue";
import SongTile from "../components/SongTile";
import SongInfoPanel from "../components/SongInfoPanel.vue"
import DifficultyPanel from "../components/DifficultyPanel.vue"
import { thumbails } from "../thumbnails";
import { useRouter } from "vue-router";
import { useSongsStore } from "../stores/songs";
import "../index.css";
import { SongDifficulty } from "../types";

const difficulties: SongDifficulty[] = [
  {
    name: "basic",
    level: 5,
  },
  {
    name: "standard",
    level: 7,
  },
  {
    name: "expert",
    level: 9,
  },
];

const songsStore = useSongsStore();

const selectedChartIndex = computed(() => {
  if (songsStore.selectedChartIdx === undefined || !songsStore.selectedSongId) {
    return undefined
  }

  return songsStore.selectedChartIdx
})

const selectedSong = computed(() => {
  const belowZeroOrder = songsStore.songs.reduce(
    (acc, curr) => (curr.order < 0 ? acc + 1 : acc),
    0
  );
  const song = songsStore.songs[focused.value + belowZeroOrder];
  if (!song) {
    throw Error(`Tried accessing song at index ${focused.value} but was null.`);
  }
  return song;
});

function nextSong() {
  //   songsStore.setSongs([
  //     ...songsStore.songs,
  //   ]);
}

watchEffect(() => {
  // console.log(focused.value, songsStore.songs.map(x => x.order).join(" "), offset.value)
});

function prevSong() {
  // let order = songsStore.songs.at(0)!.order - 1;
  // // console.log(songsStore.songs.at(0)!.order, order)
  // const next = songsStore.originalSongs[prevIndex]!;
  // if (prevIndex === 0) {
  //   prevIndex = songsStore.originalSongs.length - 1;
  // } else {
  //   prevIndex--;
  // }
  // songsStore.setSongs([
  //   { ...next, id: order.toString(), order },
  //   ...songsStore.songs,
  // ]);
}

const router = useRouter();

function durationToNum(str: string) {
  const match = /(\d+).*/.exec(str);
  if (!match?.[1]) {
    throw Error(`Could not convert ${str} to number`);
  }
  return parseInt(match[1], 10);
}

let timeoutId: number;
const durationMs = "50ms";

// function bounceFocusedSong() {
//   window.clearTimeout(timeoutId);
//   focusedSongClass.value = "bounce";
//   timeoutId = window.setTimeout(
//     () => (focusedSongClass.value = ""),
//     durationToNum(durationMs)
//   );
// }

function changeSong(event: KeyboardEvent) {
  if (event.code === "Enter") {
    songsStore.setSelectedSongId(selectedSong.value.id);
    router.push({
      path: "game",
      query: {
        song: selectedSong.value.id,
        difficulty: songsStore.selectedChart?.difficulty,
      },
    });
  }
}

onMounted(() => {
  window.addEventListener(
    "keydown",
    changeSong
    // throttle(changeSong, durationToNum(durationMs))
  );
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", changeSong);
});

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
}

.song-tiles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 50px;
  grid-auto-rows: 200px;
  column-gap: 50px;
  // overflow: scroll;
}

.info-col {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 100px
}

.song-panel {
  margin-top: 20px
}
</style>
