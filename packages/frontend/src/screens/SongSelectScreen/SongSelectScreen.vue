<template>
  <NonGameplayScreen screenTitle="Eleutheria">
    <div
      class="absolute w-screen h-screen bg-zinc-500 z-10 left-0 top-[-100vh]"
      :class="{ [animationClass]: animating }"
    />
    <div id="content">
      <div class="flex flex-col">
        <div class="flex flex-col h-full">
          <SongTile
            v-for="song of songsQuery.data?.value?.songs"
            :key="song.id"
            :songTitle="song.title"
            :artist="song.artist"
            :file="song.file"
            class="mb-4"
            :selected="song.id == selectedSong?.id"
            @click="handleSelected(song)"
          />
        </div>

        <div id="levels">
          <button
            v-for="({ level, id }, idx) of levels"
            :key="id"
            class="bg-zinc-700 text-white h-14 w-14 mr-4 text-xl border border-2"
            :class="idx === selectedChartIdx ? 'border-white' : 'border-black'"
            @click="handleSelectChart(idx)"
          >
            {{ level }}
          </button>
        </div>
      </div>

      <div class="flex flex-col justify-between">
        <SongImage :file="selectedSong?.file" />
        <div>
          <SongInfo
            :best="tableData.best"
            :notes="tableData.notes"
            :duration="tableData.duration"
            :bpm="tableData.bpm"
          />
        </div>
      </div>
      <div>
        <IconButton @click="handleAuthenticate">
          <UserIcon />
        </IconButton>

        <IconButton>
          <SettingsIcon @click="modal.showModal('options')" />
        </IconButton>
      </div>
    </div>
  </NonGameplayScreen>
</template>

<script setup lang="ts">
import { IconButton } from "./IconButton";
import { SettingsIcon } from "./SettingsIcon";
import { UserIcon } from "./UserIcon";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { SongTile } from "../../components/SongTile";
import { useRouter } from "vue-router";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import { gql, useQuery } from "@urql/vue";
import {
  SongSelectScreen_SongsDocument,
  SongSelectScreen_ChartDocument,
  SongSelectScreen_SongsQuery,
} from "../../generated/graphql";
import { SongInfo } from "../../components/SongInfo";
import { SongImage } from "./SongImage";
import { useModal } from "../../composables/modal";
import { useEmitter } from "../../composables/emitter";
import { preferencesManager } from "../gameplay/preferences";

gql`
  query SongSelectScreen_Songs {
    songs {
      id
      title
      file
      duration
      artist
      bpm
    }
  }
`;

gql`
  query SongSelectScreen_Chart($songId: Int!) {
    viewer {
      id
      email
    }
    charts(songId: $songId) {
      id
      difficulty
      level
      tapNoteCount
      personalBest
    }
  }
`;

const modal = useModal();

function handleAuthenticate() {
  if (viewer.value) {
    modal.showModal("signOut");
  } else {
    modal.showModal("signIn");
  }
}

const preferences = preferencesManager.getPreferences();

const selectedSongId = ref<number>(preferences.selectedSongId ?? 2);
const selectedChartIdx = ref<number>(preferences.selectedChartIdx ?? 0);

const songsQuery = useQuery({
  query: SongSelectScreen_SongsDocument,
});

const chartQuery = useQuery({
  query: SongSelectScreen_ChartDocument,
  variables: {
    songId: selectedSongId,
  },
  requestPolicy: "cache-and-network",
});

const emitter = useEmitter();

emitter.on("authentication:changed", () => {
  chartQuery.executeQuery({ requestPolicy: "network-only" });
});

const viewer = computed(() => {
  return chartQuery.data?.value?.viewer ?? null;
});

function handleKeyDown(event: KeyboardEvent) {
  if (selectedChartIdx.value === undefined) {
    return;
  }

  if (!chartQuery.data.value?.charts.length) {
    return;
  }

  if (
    event.code === "KeyJ" &&
    selectedChartIdx.value < chartQuery.data.value.charts.length
  ) {
    selectedChartIdx.value += 1;
  }

  if (event.code === "KeyK" && selectedChartIdx.value > 0) {
    selectedChartIdx.value -= 1;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

function handleSelectChart(idx: number) {
  selectedChartIdx.value = idx;
  preferencesManager.updatePreferences({ selectedChartIdx: idx });
}

const chartDifficulty = computed(() => {
  return selectedChart.value?.difficulty ?? "";
});

const levels = computed<Array<{ level: number; id: number }>>(() => {
  if (!chartQuery.data.value?.charts) {
    return [];
  }

  return chartQuery.data.value.charts.map((chart) => {
    return {
      id: chart.id,
      level: chart.level,
    };
  });
});

const selectedChart = computed(() => {
  return chartQuery.data.value?.charts?.[selectedChartIdx.value];
});

const selectedSong = computed(() => {
  return songsQuery.data.value?.songs?.find(
    (x) => x.id === selectedSongId.value
  );
});

const tableData = computed(() => {
  return {
    notes: selectedChart?.value?.tapNoteCount ?? "-",
    duration: selectedSong?.value?.duration ?? "-",
    bpm: selectedSong?.value?.bpm ?? "-",
    best: selectedChart.value?.personalBest
      ? `${selectedChart.value?.personalBest?.toFixed(2)}%`
      : "0.00%",
  };
});

const router = useRouter();

const animating = ref(false);
const animationMs = 200;
const animationClass = `animate-[movedown_${animationMs}ms_linear_forwards]`; // animate-[movedown_200ms_linear_forwards]

const delay = () =>
  new Promise((resolve) => window.setTimeout(resolve, animationMs + 200));

async function handleSelected(
  song: SongSelectScreen_SongsQuery["songs"][number]
) {
  if (selectedSongId.value !== song.id) {
    preferencesManager.updatePreferences({
      selectedSongId: song.id,
    });
    selectedSongId.value = song.id;
    selectedChartIdx.value = 0;
    return;
  }

  if (!chartDifficulty.value) {
    throw Error(`No difficulty was selected. This should be impossible.`);
  }

  const chartId = chartQuery.data.value?.charts.at(selectedChartIdx.value)?.id;

  if (!chartId) {
    throw Error(
      `Did not find chart at index ${selectedChartIdx.value}. Charts only has ${chartQuery.data.value?.charts.length} elements.`
    );
  }

  animating.value = true;
  await delay();

  router.push({
    path: "game",
    query: {
      songId: song.id,
      file: song.file,
      artist: song.artist,
      title: song.title,
      personalBest: selectedChart.value?.personalBest?.toFixed(2) ?? "0.00",
      chartId,
    },
  });
}
</script>

<style>
#content {
  display: grid;
  grid-template-columns: 1fr 0.65fr 50px;
  column-gap: 30px;
}

@keyframes movedown {
  100% {
    top: 0px;
  }
}
</style>
