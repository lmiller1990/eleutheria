<script lang="ts" setup>
defineProps<{
  noteCount: number;
  duration: string;
  bpm: number;
  personalBest: string;
}>();
</script>

<template>
  <div class="info-wrapper">
    <div class="info-panel text-white">
      <div>Notes</div>
      <div>{{ noteCount }}</div>

      <div>Duration</div>
      <div>{{ duration }}</div>

      <div>BPM</div>
      <div>{{ bpm }}</div>

      <div>Best</div>
      <div>{{ personalBest }}</div>
    </div>
  </div>
</template>

<style>
@import "../index.css";
@import "../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
.info-wrapper {
  display: flex;
  justify-content: center;
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
</style>
