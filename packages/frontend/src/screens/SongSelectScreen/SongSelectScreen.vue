<template>
  <NonGameplayScreen screenTitle="Eleutheria">
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
    <div id="content">
      <div class="flex flex-col">
        <div class="flex flex-col h-full">
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
        <SongImage v-if="selectedSong" :file="selectedSong?.file" />
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
        <IconButton @click="handleAuthenticate" data-cy="authenticate" v-if="gotAllMods">
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
import { SongInfo } from "../../components/SongInfo";
import SongImage from "./SongImage.vue";
import { useModal } from "../../composables/modal";
import { useEmitter } from "../../composables/emitter";
import { preferencesManager } from "../gameplay/preferences";
import { useImageLoader } from "../../composables/imageLoader";
import { useInitialLoad } from "../../composables/initialLoad";

const gotAllMods = ref(false)

Promise.all([
import('./mod-1'),
import('./mod-2'),
import('./mod-3'),
import('./mod-4'),
import('./mod-5'),
import('./mod-6'),
import('./mod-7'),
import('./mod-8'),
import('./mod-9'),
import('./mod-10'),
import('./mod-11'),
import('./mod-12'),
import('./mod-13'),
import('./mod-14'),
import('./mod-15'),
import('./mod-16'),
import('./mod-17'),
import('./mod-18'),
import('./mod-19'),
import('./mod-20'),
import('./mod-21'),
import('./mod-22'),
import('./mod-23'),
import('./mod-24'),
import('./mod-25'),
import('./mod-26'),
import('./mod-27'),
import('./mod-28'),
import('./mod-29'),
import('./mod-30'),
import('./mod-31'),
import('./mod-32'),
import('./mod-33'),
import('./mod-34'),
import('./mod-35'),
import('./mod-36'),
import('./mod-37'),
import('./mod-38'),
import('./mod-39'),
import('./mod-40'),
import('./mod-41'),
import('./mod-42'),
import('./mod-43'),
import('./mod-44'),
import('./mod-45'),
import('./mod-46'),
import('./mod-47'),
import('./mod-48'),
import('./mod-49'),
import('./mod-50'),
import('./mod-51'),
import('./mod-52'),
import('./mod-53'),
import('./mod-54'),
import('./mod-55'),
import('./mod-56'),
import('./mod-57'),
import('./mod-58'),
import('./mod-59'),
import('./mod-60'),
import('./mod-61'),
import('./mod-62'),
import('./mod-63'),
import('./mod-64'),
import('./mod-65'),
import('./mod-66'),
import('./mod-67'),
import('./mod-68'),
import('./mod-69'),
import('./mod-70'),
import('./mod-71'),
import('./mod-72'),
import('./mod-73'),
import('./mod-74'),
import('./mod-75'),
import('./mod-76'),
import('./mod-77'),
import('./mod-78'),
import('./mod-79'),
import('./mod-80'),
import('./mod-81'),
import('./mod-82'),
import('./mod-83'),
import('./mod-84'),
import('./mod-85'),
import('./mod-86'),
import('./mod-87'),
import('./mod-88'),
import('./mod-89'),
import('./mod-90'),
import('./mod-91'),
import('./mod-92'),
import('./mod-93'),
import('./mod-94'),
import('./mod-95'),
import('./mod-96'),
import('./mod-97'),
import('./mod-98'),
import('./mod-99'),
import('./mod-100'),
import('./mod-101'),
import('./mod-102'),
import('./mod-103'),
import('./mod-104'),
import('./mod-105'),
import('./mod-106'),
import('./mod-107'),
import('./mod-108'),
import('./mod-109'),
import('./mod-110'),
import('./mod-111'),
import('./mod-112'),
import('./mod-113'),
import('./mod-114'),
import('./mod-115'),
import('./mod-116'),
import('./mod-117'),
import('./mod-118'),
import('./mod-119'),
import('./mod-120'),
import('./mod-121'),
import('./mod-122'),
import('./mod-123'),
import('./mod-124'),
import('./mod-125'),
import('./mod-126'),
import('./mod-127'),
import('./mod-128'),
import('./mod-129'),
import('./mod-130'),
import('./mod-131'),
import('./mod-132'),
import('./mod-133'),
import('./mod-134'),
import('./mod-135'),
import('./mod-136'),
import('./mod-137'),
import('./mod-138'),
import('./mod-139'),
import('./mod-140'),
import('./mod-141'),
import('./mod-142'),
import('./mod-143'),
import('./mod-144'),
import('./mod-145'),
import('./mod-146'),
import('./mod-147'),
import('./mod-148'),
import('./mod-149'),
import('./mod-150'),
import('./mod-151'),
import('./mod-152'),
import('./mod-153'),
import('./mod-154'),
import('./mod-155'),
import('./mod-156'),
import('./mod-157'),
import('./mod-158'),
import('./mod-159'),
import('./mod-160'),
import('./mod-161'),
import('./mod-162'),
import('./mod-163'),
import('./mod-164'),
import('./mod-165'),
import('./mod-166'),
import('./mod-167'),
import('./mod-168'),
import('./mod-169'),
import('./mod-170'),
import('./mod-171'),
import('./mod-172'),
import('./mod-173'),
import('./mod-174'),
import('./mod-175'),
import('./mod-176'),
import('./mod-177'),
import('./mod-178'),
import('./mod-179'),
import('./mod-180'),
import('./mod-181'),
import('./mod-182'),
import('./mod-183'),
import('./mod-184'),
import('./mod-185'),
import('./mod-186'),
import('./mod-187'),
import('./mod-188'),
import('./mod-189'),
import('./mod-190'),
import('./mod-191'),
import('./mod-192'),
import('./mod-193'),
import('./mod-194'),
import('./mod-195'),
import('./mod-196'),
import('./mod-197'),
import('./mod-198'),
import('./mod-199'),
import('./mod-200'),
]).then(() => {
  gotAllMods.value =  true
  console.log('ok!')
})

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
