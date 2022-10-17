<template>
  <NonGameplayScreen screenTitle="Eleutheria">
    <div id="content">
      <div class="flex flex-col">
        <div class="flex flex-col h-full">
          <SongTile
            v-for="(song, idx) of songsQuery.data?.value?.songs"
            :key="song.id"
            :songTitle="song.title"
            :artist="song.artist"
            class="h-full mb-4"
            :imgSrc="thumbails[idx]"
            :selected="song.id === selectedSongId"
            @selected="handleSelected(song)"
          />
        </div>

        <div id="levels">
          <button
            v-for="{ level, id } in levels"
            :key="id"
            class="bg-zinc-700 text-white h-14 w-14 mr-4 text-xl border border-2 border-black"
          >
            {{ level }}
          </button>
        </div>
      </div>

      <div class="flex flex-col justify-between">
        <SongImage
          src="https://i1.sndcdn.com/artworks-I25aaV3g3bIRnsV2-jJchQg-t500x500.jpg"
        />
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
          <SettingsIcon />
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
import SongTile from "../../components/SongTile";
import { thumbails } from "../../thumbnails";
import { useRouter } from "vue-router";
import { useSongsStore } from "../../stores/songs";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import { useHeldKeys } from "../../utils/useHeldKeys";
import { gql, useQuery } from "@urql/vue";
import {
  SongSelectScreen_SongsDocument,
  SongSelectScreen_ChartDocument,
  SongSelectScreen_SongsQuery,
} from "../../generated/graphql";
import { SongInfo } from "../../components/SongInfo";
import { SongImage } from "./SongImage";
import { useModal } from "../../composables/modal";

gql`
  query SongSelectScreen_Songs {
    viewer {
      id
      email
    }
    songs {
      id
      title
      file
      imgSrc
      duration
      artist
      bpm
    }
  }
`;

gql`
  query SongSelectScreen_Chart($songId: Int!) {
    charts(songId: $songId) {
      id
      difficulty
      level
      tapNoteCount
    }
  }
`;

const songsStore = useSongsStore();
const modal = useModal();

function handleAuthenticate() {
  if (viewer.value) {
    modal.showModal("signOut");
  } else {
    modal.showModal("signIn");
  }
}

const selectedSongId = ref<number>();

const songsQuery = useQuery({
  query: SongSelectScreen_SongsDocument,
});

const chartQuery = useQuery({
  query: SongSelectScreen_ChartDocument,
  variables: {
    // @ts-expect-error - we only unpause when this is non null
    songId: selectedSongId,
  },
  pause: computed(() => !selectedSongId.value),
});

const viewer = computed(() => {
  return songsQuery.data?.value?.viewer ?? null;
});

function handleKeyDown(event: KeyboardEvent) {
  if (!songsStore.selectedSongId || songsStore.selectedChartIdx === undefined) {
    return;
  }

  if (event.code === "Enter") {
    const song = songsQuery.data.value?.songs.find(
      (x) => x.id === songsStore.selectedSongId
    );
    if (!song) {
      return;
    }
    handleSelected(song);
  }

  if (!chartQuery.data.value?.charts.length) {
    return;
  }

  if (
    event.code === "KeyJ" &&
    songsStore.selectedChartIdx < chartQuery.data.value.charts.length
  ) {
    songsStore.setSelectedChartIdx(songsStore.selectedChartIdx + 1);
  }

  if (event.code === "KeyK" && songsStore.selectedChartIdx > 0) {
    songsStore.setSelectedChartIdx(songsStore.selectedChartIdx - 1);
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

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

const selectedChart = computed(
  () => chartQuery.data.value?.charts?.[songsStore.selectedChartIdx]
);

const selectedSong = computed(() =>
  songsQuery.data.value?.songs?.find((x) => x.id === selectedSongId.value)
);

const tableData = computed(() => {
  return {
    notes: selectedChart?.value?.tapNoteCount ?? "-",
    duration: selectedSong?.value?.duration ?? "-",
    bpm: selectedSong?.value?.bpm ?? "-",
    best: "99.50%",
  };
});

const router = useRouter();
const heldKeys = useHeldKeys();

function handleSelected(song: SongSelectScreen_SongsQuery["songs"][number]) {
  selectedSongId.value = song.id;
  songsStore.setSelectedChartIdx(0);

  if (songsStore.selectedSongId === song.id) {
    // they already clicked it once
    // time to play!

    if (!chartDifficulty.value) {
      throw Error(`No difficulty was selected. This should be impossible`);
    }

    const route = heldKeys.value.has("KeyE") ? "editor" : "game";
    router.push({
      path: route,
      query: {
        songId: song.id,
        file: song.file,
        difficulty: chartDifficulty.value,
      },
    });
  } else {
    songsStore.setSelectedSongId(song.id);
  }
}
</script>

<style lang="scss" scoped>
#content {
  display: grid;
  grid-template-columns: 1fr 0.65fr 50px;
  column-gap: 30px;
}
</style>
