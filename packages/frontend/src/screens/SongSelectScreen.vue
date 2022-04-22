<template>
  <div class="h-100 w-100 max-w-l">
    <div
      class="grid grid-columns-1fr-2fr grid-column-gap-s padding-m h-100 w-100"
    >
      <div>
        <Panel>
          <SongInfo :chartSummary="chartSummary" />
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
                  'border-red-2 border-4 h-9rem selected': isSelected(song),
                  'not-selected h-5rem': !isSelected(song),
                }"
                v-for="song of songs"
                :key="song.id"
                :id="song.id"
                :song="song"
                :selectedDifficulty="selectedDifficulty"
                :selected="song.order === selectedSong.order"
              />
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "../index.css";
import type {
  BaseSong,
  Chart,
  ChartSummary,
  Difficulty,
  PersonalBest,
} from "@packages/types";
import type { Song } from "../types";
import SongItem from "../components/SongItem.vue";
import SongPersonalBest from "../components/SongPersonalBest.vue";
import SongDifficulty from "../components/SongDifficulty.vue";
import SongInfo from "../components/SongInfo.vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import SelectSongBanner from "../components/SelectSongBanner.vue";
import Panel from "../components/Panel.vue";
import { throttle } from "lodash";

const focusSongIndex = 3;
const scrollSpeed = "0.1s";

const selectedDifficulty = ref<Difficulty>("expert");
const selectedSongIdx = ref(1);
const songs = ref<Song[]>([]);

function isSelected(song: Song) {
  return songs.value.indexOf(song) === focusSongIndex;
}

function nextSong() {
  let [first, ...rest] = songs.value;
  songs.value = [...rest, first];
}

function prevSong() {
  const last = songs.value.at(-1)!;
  songs.value = [last, ...songs.value.slice(0, -1)];
}

const router = useRouter();

function changeSong(event: KeyboardEvent) {
  if (event.code === "KeyK") {
    prevSong();
  } else if (event.code === "KeyJ") {
    nextSong();
  } else if (event.code === "Enter") {
    const song = songs.value[selectedSongIdx.value];
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

const charts: Chart[] = [
  {
    difficulty: "basic",
    level: 3,
  },
  {
    difficulty: "standard",
    level: 5,
  },
  {
    difficulty: "expert",
    level: 8,
  },
];

const selectedSong = computed(() => {
  return songs.value.find((x) => x.order === selectedSongIdx.value)!;
});

async function fetchSongs() {
  const res = await window.fetch("http://localhost:8000/songs");
  const data = (await res.json()) as BaseSong[];

  let _songs: Song[] = [];

  for (let i = 0; i < 20; i++) {
    const s = data[i % data.length];
    _songs.push({
      ...s,
      order: i,
      title: `#${i}`,
      id: i.toString(),
    });
  }

  songs.value = _songs;
}

fetchSongs();
</script>

<style>
#app {
  /* https://doodad.dev/pattern-generator */
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='38' height='38' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(112)'%3E%3Crect width='100%25' height='100%25' fill='rgba(248, 242, 227,1)'/%3E%3Cpath d='M0 29.5a 9.5-9.5 0 0 0 9.5-9.5a 10.5-10.5 0 0 1 10.5-10.5v1a-9.5 9.5 0 0 0-9.5 9.5a-10.5 10.5 0 0 1-10.5 10.5zM0 69.5a 9.5-9.5 0 0 0 9.5-9.5a 10.5-10.5 0 0 1 10.5-10.5v1a-9.5 9.5 0 0 0-9.5 9.5a-10.5 10.5 0 0 1-10.5 10.5z' fill='rgba(250, 176, 63,1)' filter='url(%23filter-doodad-1)'/%3E%3Cpath d='M20 29.5a 9.5-9.5 0 0 0 9.5-9.5a 10.5-10.5 0 0 1 10.5-10.5v1a-9.5 9.5 0 0 0-9.5 9.5a-10.5 10.5 0 0 1-10.5 10.5z' fill='rgba(253, 209, 73,1)'/%3E%3C/pattern%3E%3Cfilter id='filter-doodad-1'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2' type='fractalNoise' result='result1'/%3E%3CfeDisplacementMap in2='result1' scale='0' result='result2' xChannelSelector='R' in='SourceGraphic'/%3E%3CfeComposite in2='result2' in='SourceGraphic' operator='atop' result='fbSourceGraphic'/%3E%3C/filter%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E");
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
}
</style>
