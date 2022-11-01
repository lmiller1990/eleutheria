<script lang="ts" setup>
import Gameplay from "./components/Gameplay/Gameplay.vue";
import { GameplayLoading } from "./GameplayLoading";
import { computed, reactive, ref } from "vue";
import { useAudioLoader } from "../../composables/audioLoader";
import { getParams } from "./fetchData";
import { createGameplayQuery } from "./gameplayQuery";
import { AudioData } from "@packages/shared";
import "../../style.css";

const loadingAudio = ref(true);
const bytes = reactive({
  streamed: 0,
  total: 1,
});

const { file, songId, chartId, title, artist, personalBest } = getParams();

const query = createGameplayQuery(parseInt(songId, 10), parseInt(chartId, 10));

const { emitter } = useAudioLoader(
  `${import.meta.env.VITE_CDN_URL}/${file}.wav`
);

emitter.on("song:loading:chunk", (s, t) => {
  bytes.streamed += s;
  bytes.total = t;
});

let audioData: AudioData;

function getAudioData(): AudioData {
  return audioData;
}

emitter.on("song:loading:complete", (payload) => {
  audioData = payload;
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
  <GameplayLoading
    v-if="loading"
    :percent="percent"
    :song="{
      title,
      artist,
      file,
    }"
    :personalBest="`${personalBest}%`"
  />
  <div id="game-app" v-else>
    <Gameplay v-if="gqlData" :gql="gqlData" :getAudioData="getAudioData" />
  </div>
</template>
