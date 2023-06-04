<template>
  <NonGameplayScreen>
    <Transition
      leave-active-class="transition-opacity duration-700"
      leave-to-class="opacity-0"
    >
      <LoadingScreen v-if="loading" />
    </Transition>
    <div
      class="absolute w-screen h-screen bg-zinc-500 z-10 left-0 top-[-100vh]"
      :class="{ [animationClass]: animating }"
    />
    <div class="flex items-center">
      <div class="grid grid-cols-[1fr_0.5fr_50px] gap-x-7">
        <div class="flex flex-col">
          <div class="flex flex-col">
            <SongTile
              v-for="song of songs"
              :key="song.id"
              :songTitle="song.title"
              :artist="song.artist"
              :file="song.file"
              class="mb-4"
              :selected="song.id == selectedSong?.id"
              @click="handleSelected(song)"
            />
          </div>

          <div class="mt-8" id="levels">
            <button
              v-for="({ level, id }, idx) of levels"
              :key="id"
              class="bg-zinc-700 text-white h-10 w-10 tall:h-14 tall:w-14 mr-4 tall:text-xl border border-2"
              :class="
                idx === selectedChartIdx ? 'border-white' : 'border-black'
              "
              @click="handleSelectChart(idx)"
            >
              {{ level }}
            </button>
          </div>
        </div>

        <div class="flex flex-col">
          <SongImage v-if="selectedSong" :file="selectedSong?.file">
            <template #info>
              <IconButton
                size="25px"
                class="bg-zinc-700 text-white absolute bottom-2 right-2 text-xl font-mono flex items-center justify-center"
                @click="() => (showSongInfo = !showSongInfo)"
              >
                <InfoIcon />
              </IconButton>
            </template>
          </SongImage>

          <div class="tall:h-[336px]">
            <SongInfo
              v-if="showSongInfo"
              :best="tableData.best"
              :notes="tableData.notes"
              :duration="tableData.duration"
              :bpm="tableData.bpm"
            />

            <ArtistInfo
              v-else
              :composer="composer"
              :artist="selectedSong?.artist!"
            />
          </div>
        </div>

        <div>
          <IconButton @click="handleAuthenticate" data-cy="authenticate">
            <UserIcon />
          </IconButton>

          <IconButton>
            <SettingsIcon @click="modal.showModal('options')" />
          </IconButton>
        </div>
      </div>
    </div>
  </NonGameplayScreen>
</template>

<script setup lang="ts">
import { IconButton } from "./IconButton";
import LoadingScreen from "./LoadingScreen.vue";
import { SettingsIcon } from "./SettingsIcon";
import { UserIcon } from "./UserIcon";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import SongTile from "../../components/SongTile.vue";
import { useRouter } from "vue-router";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import { gql, useQuery } from "@urql/vue";
import {
  SongSelectScreen_SongsDocument,
  SongSelectScreen_ChartDocument,
  SongSelectScreen_SongsQuery,
} from "../../generated/graphql";
import SongInfo from "../../components/SongInfo.vue";
import SongImage from "./SongImage.vue";
import { useModal } from "../../composables/modal";
import { useEmitter } from "../../composables/emitter";
import { preferencesManager } from "../gameplay/preferences";
import { useImageLoader } from "../../composables/imageLoader";
import { useInitialLoad } from "../../composables/initialLoad";
import ArtistInfo from "../../components/ArtistInfo.vue";
import InfoIcon from "../../components/InfoIcon.vue";

gql`
  query SongSelectScreen_Songs {
    songs {
      id
      title
      file
      duration
      artist
      bpm
      creator {
        id
        name
        socials {
          id
          link
          social
        }
      }
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
const { initial } = useInitialLoad();
const loading = ref(initial.value);

useImageLoader("songSelectScreen", {
  onAllLoaded: () => {
    loading.value = false;
  },
  target: window.__SONG_COUNT__,
  minimumLoadTimeMs: initial.value ? 1000 : 0,
});

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

const composer = computed(() => {
  return selectedSong.value?.creator!;
});

const songs = computed(
  () =>
    songsQuery.data?.value?.songs.sort((x, y) =>
      x.title.localeCompare(y.title)
    ) ?? []
);

function handleKeyDown(event: KeyboardEvent) {
  if (selectedChartIdx.value === undefined) {
    return;
  }

  if (!chartQuery.data.value?.charts.length) {
    return;
  }

  if (event.code === "ArrowUp" && selectedSong) {
    const idx =
      songs.value?.findIndex((x) => x.id === selectedSongId.value) ?? -1;
    if (idx > 0) {
      const next = songs.value?.[idx - 1];
      if (next) {
        handleSelected(next);
      }
    }
  }

  if (event.code === "ArrowDown" && selectedSong) {
    const idx =
      songs.value?.findIndex((x) => x.id === selectedSongId.value) ?? -1;
    if (idx + 1 < songs.value.length) {
      const next = songs.value?.[idx + 1];
      if (next) {
        handleSelected(next);
      }
    }
  }

  if (
    event.code === "ArrowRight" &&
    selectedChartIdx.value + 1 < chartQuery.data.value.charts.length
  ) {
    handleSelectChart(selectedChartIdx.value + 1);
  }

  if (event.code === "ArrowLeft" && selectedChartIdx.value > 0) {
    handleSelectChart(selectedChartIdx.value - 1);
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
  preferencesManager.updatePreferences({
    selectedChartIdx: idx,
    preferredSongChartIndex: {
      [selectedSongId.value]: idx,
    },
  });
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

const showSongInfo = ref(true);
const animating = ref(false);
const animationMs = 200;
const animationClass = `animate-[movedown_${animationMs}ms_linear_forwards]`; // animate-[movedown_200ms_linear_forwards]

const delay = () =>
  new Promise((resolve) => window.setTimeout(resolve, animationMs + 200));

async function handleSelected(
  song: SongSelectScreen_SongsQuery["songs"][number]
) {
  const preferences = preferencesManager.getPreferences();
  if (selectedSongId.value !== song.id) {
    preferencesManager.updatePreferences({
      selectedSongId: song.id,
    });
    selectedSongId.value = song.id;
    selectedChartIdx.value =
      preferences.preferredSongChartIndex?.[song.id] ?? 0;
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
@keyframes movedown {
  100% {
    top: 0px;
  }
}
</style>
