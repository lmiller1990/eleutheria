<script lang="ts" setup>
import Gameplay from "./components/Gameplay/Gameplay.vue";
import { GameplayLoading, useAudioLoader } from "./GameplayLoading";
import "../../style.css";
import { computed, reactive, ref } from "vue";
import { gql, useQuery } from "@urql/vue";
import { GameplayDocument } from "../../generated/graphql";
import { getParams } from "./fetchData";

gql`
  query Gameplay($songId: Int!, $chartId: Int!) {
    song(songId: $songId) {
      id
      offset
      title
      file
      artist
      chart(chartId: $chartId) {
        id
        difficulty
        offset
        level
        parsedTapNoteChart {
          id
          ms
          column
          measureNumber
          char
        }
      }
    }
  }
`;

const loadingAudio = ref(true);
const bytes = reactive({
  streamed: 0,
  total: 1,
});

const { file, songId, chartId } = getParams();

const query = useQuery({
  query: GameplayDocument,
  requestPolicy: "network-only",
  variables: {
    songId: parseInt(songId, 10),
    chartId: parseInt(chartId, 10),
  },
});

const { emitter } = useAudioLoader(
  `${import.meta.env.VITE_CDN_URL}/${file}.wav`
);

emitter.on("song:loading:chunk", (s, t) => {
  bytes.streamed += s;
  bytes.total = t;
});

let audioBuffer: AudioBuffer;

function getAudioBuffer() {
  return audioBuffer;
}

emitter.on("song:loading:complete", (buffer) => {
  audioBuffer = buffer;
  loadingAudio.value = false;
});

const percent = computed(() => {
  return Math.round((bytes.streamed / bytes.total) * 100);
});

const loading = computed(() => loadingAudio.value || query.fetching.value);
const gqlData = computed(() => {
  if (!query.fetching.value && !query.data.value?.song.chart) {
    throw Error("Finishing loading with unexpected data");
  }
  return query.data.value;
});
</script>

<template>
  <div v-if="loading">
    <GameplayLoading :percent="percent" />
  </div>
  <div id="game-app" v-else>
    <Gameplay :getAudioBuffer="getAudioBuffer" v-if="gqlData" :gql="gqlData" />
  </div>
</template>
