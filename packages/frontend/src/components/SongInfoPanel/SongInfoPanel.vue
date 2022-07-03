<script lang="ts" setup>
import type { SongInfoPanelProps } from './types'
import InfoPanel from '../InfoPanel'

const props = defineProps<SongInfoPanelProps>();
</script>

<template>
  <InfoPanel panelTitle="Stats" :highlightColor="props.highlightColor">

    <div class="info-panel text-white">
      <div>Notes</div>
      <div>{{ props.noteCount ?? "-" }}</div>

      <div>Duration</div>
      <div>{{ props.duration ?? "-" }}</div>

      <div>BPM</div>
      <div>{{ props.bpm ?? "-" }}</div>

      <div>Best</div>
      <div>{{ props.personalBest ?? "-" }}</div>
    </div>
  </InfoPanel>
</template>

<style>
@import "../../index.css";
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../shared.scss";

$border: 3px;

.info-panel {
  display: grid;
  width: 100%;
  padding: 10px 20px 0 50px;
  grid-template-columns: 1fr 1fr;
  font-family: "Sansation", sans-serif;
  font-size: 1.5rem;
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
