<template>
  <NonGameplayScreen screenTitle="Select Song">
    <div class="flex justify-end mb-4">
      <Username />
    </div>
    <div class="wrapper max-w-screen-lg h-full">
      <div class="tiles flex items-center justify-center">
        <SongTile
          v-for="(song, idx) of songsQuery.data?.value?.songs"
          :key="song.id"
          :songTitle="song.title"
          class="h-full"
          :imgSrc="thumbails[idx]"
          :selected="song.id === selectedSongId"
          @selected="handleSelected(song.id)"
        />
      </div>

      <div class="info-col">
        <DifficultyPanel
          :difficulties="difficulties"
          :selectedIndex="songsStore.selectedChartIdx"
          @selected="(idx) => songsStore.setSelectedChartIdx(idx)"
        />

        <SongInfoPanel
          class="w-full song-panel"
          :class="chartDifficulty"
          :data="tableData"
          :highlightColor="highlightColor"
        />
      </div>
    </div>
  </NonGameplayScreen>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import SongTile from "../../components/SongTile";
import SongInfoPanel from "../../components/SongInfoPanel";
import DifficultyPanel from "../../components/DifficultyPanel.vue";
import { thumbails } from "../../thumbnails";
import { useRouter } from "vue-router";
import { useSongsStore } from "../../stores/songs";
import { SongDifficulty } from "../../types";
import { colors } from "../../shared";
import { TableCell } from "../../components/SongInfoPanel/types";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import { useHeldKeys } from "../../utils/useHeldKeys";
import Username from "./Username.vue";
import { gql, useQuery } from "@urql/vue";
import {
  SongSelectScreen_SongsDocument,
  SongSelectScreen_ChartDocument,
} from "../../generated/graphql";

gql`
  query SongSelectScreen_Songs {
    songs {
      id
      title
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

function handleKeyDown(event: KeyboardEvent) {
  if (!songsStore.selectedSongId || songsStore.selectedChartIdx === undefined) {
    return;
  }

  if (event.code === "Enter") {
    handleSelected(songsStore.selectedSongId);
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

const highlightColor = computed(() => {
  return colors[chartDifficulty.value] ?? "yellow";
});

const difficulties = computed<SongDifficulty[]>(() => {
  if (!chartQuery.data.value?.charts) {
    return [];
  }

  return chartQuery.data.value.charts.map((chart) => {
    return {
      name: chart.difficulty,
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

const tableData = computed<TableCell[]>(() => {
  if (!selectedChart.value || !selectedSong.value) {
    return ["Notes", "Duration", "BPM", "Best"].map((title) => ({
      title,
      content: "-",
    }));
  }

  return [
    {
      title: "Notes",
      content: selectedChart.value.tapNoteCount ?? "-",
    },
    {
      title: "Duration",
      content: selectedSong?.value.duration ?? "-",
    },
    {
      title: "BPM",
      content: selectedSong?.value.bpm ?? "-",
    },
    {
      title: "Best",
      content: "99.50%",
    },
  ];
});

const router = useRouter();
const heldKeys = useHeldKeys();

function handleSelected(songId: number) {
  selectedSongId.value = songId;
  songsStore.setSelectedChartIdx(0);

  if (songsStore.selectedSongId === songId) {
    // they already clicked it once
    // time to play!

    if (!chartDifficulty.value) {
      throw Error(`No difficulty was selected. This should be impossible`);
    }

    const route = heldKeys.value.has("KeyE") ? "editor" : "game";
    router.push({
      path: route,
      query: {
        songId: songId,
        difficulty: chartDifficulty.value,
      },
    });
  } else {
    songsStore.setSelectedSongId(songId);
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  width: 100%;
  column-gap: 80px;
}

.info-col {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.song-panel {
  margin-top: 20px;
}

.tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 1fr);
  row-gap: 50px;
  column-gap: 50px;
}

.max-1024 {
  max-width: 1024px;
}
</style>
