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
                  'h-9rem selected': isSelected(song),
                  'not-selected h-5rem': !isSelected(song),
                }"
                v-for="song of songs"
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
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import SelectSongBanner from "../components/SelectSongBanner.vue";
import Panel from "../components/Panel.vue";
import { throttle } from "lodash";

const focusSongIndex = 3;
const scrollSpeed = "0.1s";

const selectedDifficulty = ref<Difficulty>("expert");
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
    const song = songs.value[focusSongIndex];
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

async function fetchSongs() {
  const res = await window.fetch("http://localhost:8000/songs");
  const data = (await res.json()) as BaseSong[];

  let _songs: Song[] = [];

  for (let i = 0; i < 20; i++) {
    const s = data[i % data.length];
    _songs.push({
      ...s,
      order: i,
      title: `#${i}: ${s.title}`,
      key: i.toString(),
    });
  }

  songs.value = _songs;
}

fetchSongs();
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
