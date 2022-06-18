<template>
  <div class="flex flex-col w-100 song-select-screen">
    <div id="nav-top" class="nav yellow-2 flex justify-end items-center">
      Select Music
    </div>
    <div class="nav-border"></div>
    <div id="content-wrapper" class="flex w-100 justify-center">
      <div id="content" class="flex justify-center w-100">
        <div id="dummy-col" class="h-10">
          <!-- create space for absolutely positioned song wheel -->
        </div>
        <div class="flex-grow">
          <div class="flex flex-col justify-end h-100" id="song-info-wrapper">
            <SongInfo />
          </div>
        </div>
      </div>
    </div>
    <div class="nav-border-bottom green-2"></div>
    <div class="nav blue-1" id="nav-bottom"></div>

    <template v-if="songsStore.songs.length">
      <SongWheelItem
        :songTitle="`${selectedSong.order}: ${selectedSong.title}`"
        class="main-song-wheel-item"
        :class="focusedSongClass"
        :charts="selectedSong.charts"
        :levelIndex="songsStore.selectedChartIdx"
        :style="wheelItemStyle"
        id="focused-song"
      />
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
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import throttle from "lodash/throttle";
import { useRouter } from "vue-router";
import SongItemCompact from "../components/SongItemCompact.vue";
import SongWheelItem from "../components/SongWheelItem.vue";
import { useSongsStore } from "../stores/songs";
import "../index.css";
import SongInfo from "../components/SongInfo.vue";

const scrollSpeed = "0.1s";
const wheelLeft = 200;

const songsStore = useSongsStore();

const wheelItemStyle = {
  left: `${40 + wheelLeft}px`,
};

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
  const left = offset.value * 12 + wheelLeft;
  return {
    top: `${top}px`,
    left: `${left}px`,
  };
});

const offset = ref(0);
const focusedSongClass = ref<"bounce" | "">("");

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

const focused = computed(() => 4 - offset.value);

let nextIndex = 0;
let prevIndex = 2;

function nextSong() {
  offset.value--;

  let order = songsStore.songs.at(-1)!.order + 1;
  const next = songsStore.originalSongs[nextIndex]!;
  if (nextIndex === songsStore.originalSongs.length - 1) {
    nextIndex = 0;
  } else {
    nextIndex++;
  }

  songsStore.setSongs([
    ...songsStore.songs,
    { ...next, id: order.toString(), order },
  ]);
}

watchEffect(() => {
  // console.log(focused.value, songsStore.songs.map(x => x.order).join(" "), offset.value)
});

function prevSong() {
  offset.value++;

  let order = songsStore.songs.at(0)!.order - 1;
  // console.log(songsStore.songs.at(0)!.order, order)
  const next = songsStore.originalSongs[prevIndex]!;
  if (prevIndex === 0) {
    prevIndex = songsStore.originalSongs.length - 1;
  } else {
    prevIndex--;
  }
  songsStore.setSongs([
    { ...next, id: order.toString(), order },
    ...songsStore.songs,
  ]);
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

function bounceFocusedSong() {
  window.clearTimeout(timeoutId);
  focusedSongClass.value = "bounce";
  timeoutId = window.setTimeout(
    () => (focusedSongClass.value = ""),
    durationToNum(durationMs)
  );
}

function changeSong(event: KeyboardEvent) {
  if (["KeyJ", "KeyK"].includes(event.code)) {
    songsStore.setSelectedChartIdx(0);
    bounceFocusedSong();

    if (event.code === "KeyK") {
      prevSong();
    } else if (event.code === "KeyJ") {
      nextSong();
    }
  }

  if (event.code === "KeyH") {
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
    throttle(changeSong, durationToNum(durationMs))
  );
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", changeSong);
});

songsStore.fetchSongs();
</script>

<style lang="scss">
@import "../shared.scss";

:root {
  --focused-song-top: 275px;
}

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
  top: var(--focused-song-top);
  z-index: 10;
}

$nav: 75px;
$border-height: 5px;

.nav {
  height: $nav;
  width: 100%;
}

$px: 100;

.nav-border {
  width: 100%;
  height: $border-height;
  background: repeating-linear-gradient(
    90deg,
    red,
    red calc(1px * $px),
    orange calc(1px * $px),
    orange calc(2px * $px),
    yellow calc(2px * $px),
    yellow calc(3px * $px),
    green calc(3px * $px),
    green calc(4px * $px),
    blue calc(4px * $px),
    blue calc(5px * $px)
  );
}

#content-wrapper {
  flex-grow: 1;
}

#content {
  flex-grow: 1;
  max-width: 1080px;
}

.nav-border-bottom {
  height: $border-height;
}

#nav-top {
  padding: 0 50px;
  font-size: 2rem;
}

.song-select-screen {
  height: 100%;
  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='60' height='60' patternTransform='scale(2) rotate(155)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M29.998 26.65v6.693zm-6.837 3.347h3.488zm10.185 0h3.489zm0 0a3.349 3.346 0 01-3.348 3.346 3.349 3.346 0 01-3.349-3.346 3.349 3.346 0 013.349-3.346 3.349 3.346 0 013.348 3.346zm-3.173-6.832c-1.978-.032-3.976.786-5.29 2.287-1.986 2.163-2.275 5.629-.727 8.113 1.45 2.442 4.522 3.736 7.287 3.116 3.067-.607 5.45-3.561 5.392-6.684.045-2.643-1.642-5.173-4.042-6.245a6.489 6.489 0 00-2.62-.587zM59.995 52.87v14.25zm-14.557 7.125h7.428zm21.687 0h7.427zm0 0a7.13 7.124 0 01-7.13 7.124 7.13 7.124 0 01-7.13-7.124 7.13 7.124 0 017.13-7.125 7.13 7.124 0 017.13 7.125zm-6.757-14.547c-4.212-.069-8.465 1.673-11.262 4.869-4.23 4.606-4.845 11.985-1.55 17.274 3.09 5.2 9.628 7.954 15.517 6.635 6.53-1.292 11.604-7.583 11.48-14.231.096-5.628-3.495-11.014-8.606-13.298-1.757-.813-3.665-1.217-5.58-1.249zM-.005 52.87v14.25zm-14.557 7.125h7.428zm21.687 0h7.427zm0 0a7.13 7.124 0 01-7.13 7.124 7.13 7.124 0 01-7.13-7.124 7.13 7.124 0 017.13-7.125 7.13 7.124 0 017.13 7.125zM.368 45.447c-4.212-.069-8.465 1.673-11.262 4.869-4.23 4.606-4.845 11.985-1.55 17.274 3.09 5.2 9.628 7.954 15.517 6.635 6.53-1.292 11.604-7.583 11.48-14.231.096-5.628-3.495-11.014-8.606-13.298-1.757-.813-3.665-1.217-5.58-1.249zM59.995-7.13V7.12zM45.438-.006h7.428zm21.687 0h7.427zm0 0a7.13 7.124 0 01-7.13 7.124 7.13 7.124 0 01-7.13-7.124 7.13 7.124 0 017.13-7.125 7.13 7.124 0 017.13 7.125zm-6.757-14.547c-4.212-.069-8.465 1.673-11.262 4.869C44.876-5.078 44.26 2.3 47.556 7.59c3.09 5.2 9.628 7.954 15.517 6.635 6.53-1.292 11.604-7.583 11.48-14.231.096-5.628-3.495-11.014-8.606-13.298-1.757-.813-3.665-1.217-5.58-1.249zM-.005-7.13V7.12zM-14.562-.006h7.428zm21.687 0h7.427zm0 0a7.13 7.124 0 01-7.13 7.124 7.13 7.124 0 01-7.13-7.124 7.13 7.124 0 017.13-7.125 7.13 7.124 0 017.13 7.125zM.368-14.553c-4.212-.069-8.465 1.673-11.262 4.869-4.23 4.606-4.845 11.985-1.55 17.274 3.09 5.2 9.628 7.954 15.517 6.635 6.53-1.292 11.604-7.583 11.48-14.231.096-5.628-3.495-11.014-8.606-13.298-1.757-.813-3.665-1.217-5.58-1.249z'  stroke-width='0.5' stroke='hsla(199, 98%, 48%, 1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
}

#dummy-col {
  width: 750px;
}

#song-info-wrapper {
  padding: 0 0 50px 0;
}

.main-song-wheel-item {
  transition: 1s;
}

@keyframes jiggle {
  0% {
    top: calc(var(--focused-song-top) + 5px);
  }

  100% {
    top: var(--focused-song-top);
  }
}

.bounce {
  animation: jiggle v-bind("durationMs");
}
</style>
