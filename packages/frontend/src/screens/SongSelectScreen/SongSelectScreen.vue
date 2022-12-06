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
        <IconButton @click="handleAuthenticate" data-cy="authenticate">
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

import * as mod1 from './mod-1'
import * as mod2 from './mod-2'
import * as mod3 from './mod-3'
import * as mod4 from './mod-4'
import * as mod5 from './mod-5'
import * as mod6 from './mod-6'
import * as mod7 from './mod-7'
import * as mod8 from './mod-8'
import * as mod9 from './mod-9'
import * as mod10 from './mod-10'
import * as mod11 from './mod-11'
import * as mod12 from './mod-12'
import * as mod13 from './mod-13'
import * as mod14 from './mod-14'
import * as mod15 from './mod-15'
import * as mod16 from './mod-16'
import * as mod17 from './mod-17'
import * as mod18 from './mod-18'
import * as mod19 from './mod-19'
import * as mod20 from './mod-20'
import * as mod21 from './mod-21'
import * as mod22 from './mod-22'
import * as mod23 from './mod-23'
import * as mod24 from './mod-24'
import * as mod25 from './mod-25'
import * as mod26 from './mod-26'
import * as mod27 from './mod-27'
import * as mod28 from './mod-28'
import * as mod29 from './mod-29'
import * as mod30 from './mod-30'
import * as mod31 from './mod-31'
import * as mod32 from './mod-32'
import * as mod33 from './mod-33'
import * as mod34 from './mod-34'
import * as mod35 from './mod-35'
import * as mod36 from './mod-36'
import * as mod37 from './mod-37'
import * as mod38 from './mod-38'
import * as mod39 from './mod-39'
import * as mod40 from './mod-40'
import * as mod41 from './mod-41'
import * as mod42 from './mod-42'
import * as mod43 from './mod-43'
import * as mod44 from './mod-44'
import * as mod45 from './mod-45'
import * as mod46 from './mod-46'
import * as mod47 from './mod-47'
import * as mod48 from './mod-48'
import * as mod49 from './mod-49'
import * as mod50 from './mod-50'
import * as mod51 from './mod-51'
import * as mod52 from './mod-52'
import * as mod53 from './mod-53'
import * as mod54 from './mod-54'
import * as mod55 from './mod-55'
import * as mod56 from './mod-56'
import * as mod57 from './mod-57'
import * as mod58 from './mod-58'
import * as mod59 from './mod-59'
import * as mod60 from './mod-60'
import * as mod61 from './mod-61'
import * as mod62 from './mod-62'
import * as mod63 from './mod-63'
import * as mod64 from './mod-64'
import * as mod65 from './mod-65'
import * as mod66 from './mod-66'
import * as mod67 from './mod-67'
import * as mod68 from './mod-68'
import * as mod69 from './mod-69'
import * as mod70 from './mod-70'
import * as mod71 from './mod-71'
import * as mod72 from './mod-72'
import * as mod73 from './mod-73'
import * as mod74 from './mod-74'
import * as mod75 from './mod-75'
import * as mod76 from './mod-76'
import * as mod77 from './mod-77'
import * as mod78 from './mod-78'
import * as mod79 from './mod-79'
import * as mod80 from './mod-80'
import * as mod81 from './mod-81'
import * as mod82 from './mod-82'
import * as mod83 from './mod-83'
import * as mod84 from './mod-84'
import * as mod85 from './mod-85'
import * as mod86 from './mod-86'
import * as mod87 from './mod-87'
import * as mod88 from './mod-88'
import * as mod89 from './mod-89'
import * as mod90 from './mod-90'
import * as mod91 from './mod-91'
import * as mod92 from './mod-92'
import * as mod93 from './mod-93'
import * as mod94 from './mod-94'
import * as mod95 from './mod-95'
import * as mod96 from './mod-96'
import * as mod97 from './mod-97'
import * as mod98 from './mod-98'
import * as mod99 from './mod-99'
import * as mod100 from './mod-100'
import * as mod101 from './mod-101'
import * as mod102 from './mod-102'
import * as mod103 from './mod-103'
import * as mod104 from './mod-104'
import * as mod105 from './mod-105'
import * as mod106 from './mod-106'
import * as mod107 from './mod-107'
import * as mod108 from './mod-108'
import * as mod109 from './mod-109'
import * as mod110 from './mod-110'
import * as mod111 from './mod-111'
import * as mod112 from './mod-112'
import * as mod113 from './mod-113'
import * as mod114 from './mod-114'
import * as mod115 from './mod-115'
import * as mod116 from './mod-116'
import * as mod117 from './mod-117'
import * as mod118 from './mod-118'
import * as mod119 from './mod-119'
import * as mod120 from './mod-120'
import * as mod121 from './mod-121'
import * as mod122 from './mod-122'
import * as mod123 from './mod-123'
import * as mod124 from './mod-124'
import * as mod125 from './mod-125'
import * as mod126 from './mod-126'
import * as mod127 from './mod-127'
import * as mod128 from './mod-128'
import * as mod129 from './mod-129'
import * as mod130 from './mod-130'
import * as mod131 from './mod-131'
import * as mod132 from './mod-132'
import * as mod133 from './mod-133'
import * as mod134 from './mod-134'
import * as mod135 from './mod-135'
import * as mod136 from './mod-136'
import * as mod137 from './mod-137'
import * as mod138 from './mod-138'
import * as mod139 from './mod-139'
import * as mod140 from './mod-140'
import * as mod141 from './mod-141'
import * as mod142 from './mod-142'
import * as mod143 from './mod-143'
import * as mod144 from './mod-144'
import * as mod145 from './mod-145'
import * as mod146 from './mod-146'
import * as mod147 from './mod-147'
import * as mod148 from './mod-148'
import * as mod149 from './mod-149'
import * as mod150 from './mod-150'
import * as mod151 from './mod-151'
import * as mod152 from './mod-152'
import * as mod153 from './mod-153'
import * as mod154 from './mod-154'
import * as mod155 from './mod-155'
import * as mod156 from './mod-156'
import * as mod157 from './mod-157'
import * as mod158 from './mod-158'
import * as mod159 from './mod-159'
import * as mod160 from './mod-160'
import * as mod161 from './mod-161'
import * as mod162 from './mod-162'
import * as mod163 from './mod-163'
import * as mod164 from './mod-164'
import * as mod165 from './mod-165'
import * as mod166 from './mod-166'
import * as mod167 from './mod-167'
import * as mod168 from './mod-168'
import * as mod169 from './mod-169'
import * as mod170 from './mod-170'
import * as mod171 from './mod-171'
import * as mod172 from './mod-172'
import * as mod173 from './mod-173'
import * as mod174 from './mod-174'
import * as mod175 from './mod-175'
import * as mod176 from './mod-176'
import * as mod177 from './mod-177'
import * as mod178 from './mod-178'
import * as mod179 from './mod-179'
import * as mod180 from './mod-180'
import * as mod181 from './mod-181'
import * as mod182 from './mod-182'
import * as mod183 from './mod-183'
import * as mod184 from './mod-184'
import * as mod185 from './mod-185'
import * as mod186 from './mod-186'
import * as mod187 from './mod-187'
import * as mod188 from './mod-188'
import * as mod189 from './mod-189'
import * as mod190 from './mod-190'
import * as mod191 from './mod-191'
import * as mod192 from './mod-192'
import * as mod193 from './mod-193'
import * as mod194 from './mod-194'
import * as mod195 from './mod-195'
import * as mod196 from './mod-196'
import * as mod197 from './mod-197'
import * as mod198 from './mod-198'
import * as mod199 from './mod-199'
import * as mod200 from './mod-200'

console.log(
mod1,
mod2,
mod3,
mod4,
mod5,
mod6,
mod7,
mod8,
mod9,
mod10,
mod11,
mod12,
mod13,
mod14,
mod15,
mod16,
mod17,
mod18,
mod19,
mod20,
mod21,
mod22,
mod23,
mod24,
mod25,
mod26,
mod27,
mod28,
mod29,
mod30,
mod31,
mod32,
mod33,
mod34,
mod35,
mod36,
mod37,
mod38,
mod39,
mod40,
mod41,
mod42,
mod43,
mod44,
mod45,
mod46,
mod47,
mod48,
mod49,
mod50,
mod51,
mod52,
mod53,
mod54,
mod55,
mod56,
mod57,
mod58,
mod59,
mod60,
mod61,
mod62,
mod63,
mod64,
mod65,
mod66,
mod67,
mod68,
mod69,
mod70,
mod71,
mod72,
mod73,
mod74,
mod75,
mod76,
mod77,
mod78,
mod79,
mod80,
mod81,
mod82,
mod83,
mod84,
mod85,
mod86,
mod87,
mod88,
mod89,
mod90,
mod91,
mod92,
mod93,
mod94,
mod95,
mod96,
mod97,
mod98,
mod99,
mod100,
mod101,
mod102,
mod103,
mod104,
mod105,
mod106,
mod107,
mod108,
mod109,
mod110,
mod111,
mod112,
mod113,
mod114,
mod115,
mod116,
mod117,
mod118,
mod119,
mod120,
mod121,
mod122,
mod123,
mod124,
mod125,
mod126,
mod127,
mod128,
mod129,
mod130,
mod131,
mod132,
mod133,
mod134,
mod135,
mod136,
mod137,
mod138,
mod139,
mod140,
mod141,
mod142,
mod143,
mod144,
mod145,
mod146,
mod147,
mod148,
mod149,
mod150,
mod151,
mod152,
mod153,
mod154,
mod155,
mod156,
mod157,
mod158,
mod159,
mod160,
mod161,
mod162,
mod163,
mod164,
mod165,
mod166,
mod167,
mod168,
mod169,
mod170,
mod171,
mod172,
mod173,
mod174,
mod175,
mod176,
mod177,
mod178,
mod179,
mod180,
mod181,
mod182,
mod183,
mod184,
mod185,
mod186,
mod187,
mod188,
mod189,
mod190,
mod191,
mod192,
mod193,
mod194,
mod195,
mod196,
mod197,
mod198,
mod199,
mod200
)

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
