<script lang="ts" setup>
import Gameplay from "./components/Gameplay/Gameplay.vue";
import { GameplayLoading } from "./GameplayLoading";
import "../../style.css";
import { computed, reactive, ref } from "vue";
import { gql, useQuery } from "@urql/vue";
import { GameplayDocument } from "../../generated/graphql";
import { useAudioLoader } from "../../composables/audioLoader";
import { getParams } from "./fetchData";
import { AudioData } from "@packages/shared";

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
let audioContext: AudioContext;

function getAudioData(): AudioData {
  return { audioBuffer, audioContext };
}

emitter.on("song:loading:complete", (payload) => {
  audioBuffer = payload.audioBuffer;
  audioContext = payload.audioContext;
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
    <Gameplay :getAudioData="getAudioData" v-if="gqlData" :gql="gqlData" />
  </div>
</template>
