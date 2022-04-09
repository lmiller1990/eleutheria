<template>
  <div class="flex justify-center h-100 items-center flex-col">
    <div class="w-100 h-5rem flex justify-center margin-vertical-m">
      <div
        class="max-w-l w-100 font-3 upcase blue-3 padding-horizontal-s rounded-border-m shadow"
      >
        Select Music
      </div>
    </div>

    <div
      class="grid grid-columns-repeat-2 grid-column-gap-s padding-m h-100 max-w-l w-100"
    >
      <div class="grid grid-row-gap-m">
        <SongBanner v-if="selectedSong" :banner="selectedSong.banner" />
        <div class="grid grid-columns-repeat-2 items-start rounded-border-s">
          <div>
            <Panel>
              <SongPersonalBest :personalBest="personalBest" />
            </Panel>
            <Panel>
              <SongDifficulty :charts="charts" selected="expert" />
            </Panel>
          </div>
          <Panel>
            <SongInfo :chartSummary="chartSummary" />
          </Panel>
        </div>
      </div>

      <div class="margin-top-5rem">
        <SongItem
          class="h-8rem margin-bottom-1rem"
          :class="{ shadow: selectedSong.order === song.order }"
          v-for="song of songs"
          :key="song.id"
          :id="song.id"
          :song="song"
          :selectedDifficulty="selectedDifficulty"
          :selected="song.order === selectedSong.order"
        />
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
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import SongBanner from "../components/SongBanner.vue";
import Panel from "../components/Panel.vue";

const selectedDifficulty = ref<Difficulty>("expert");
const selectedSongIdx = ref(1);

function nextSong() {
  if (selectedSongIdx.value >= songs.value.length - 1) {
    return;
  }
  selectedSongIdx.value++;
}

function prevSong() {
  if (selectedSongIdx.value === 0) {
    return;
  }
  selectedSongIdx.value--;
}

watchEffect(() => console.log(selectedSongIdx.value));

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
  songs.value = data.map((song, order) => ({ ...song, order }));
}

fetchSongs();
</script>
