<script lang="ts" setup>
import { computed } from "vue";
import { useSongsStore } from "../stores/songs";

defineProps<{
  noteCount?: number;
  duration?: string;
  bpm?: number;
  personalBest?: string;
}>();

const store = useSongsStore();

const chartDifficulty = computed(() => {
  return store.selectedChart?.difficulty ?? "";
});
</script>

<template>
  <div class="info-wrapper" :class="chartDifficulty">
    <div class="info-panel text-white">
      <div>Notes</div>
      <div>{{ noteCount ?? "-" }}</div>

      <div>Duration</div>
      <div>{{ duration ?? "-" }}</div>

      <div>BPM</div>
      <div>{{ bpm ?? "-" }}</div>

      <div>Best</div>
      <div>{{ personalBest ?? "-" }}</div>
    </div>
  </div>
</template>

<style>
@import "../index.css";
@import "../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../shared.scss";

$border: 3px;

.info-wrapper {
  display: flex;
  justify-content: center;
  border: $border solid transparent;
}

.info-panel {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  font-family: "Sansation", sans-serif;
  background: #373737;
  font-size: 1.5rem;
  padding: 20px;
}

.basic {
  border: $border solid $basic;
}

.standard {
  border: $border solid $standard;
}

.expert {
  border: $border solid $expert;
}
</style>
