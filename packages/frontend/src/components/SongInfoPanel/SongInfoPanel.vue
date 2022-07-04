<script lang="ts" setup>
import type { SongInfoPanelProps } from "./types";
import InfoPanel from "../InfoPanel";

const props = defineProps<SongInfoPanelProps>();
</script>

<template>
  <InfoPanel panelTitle="Stats" :highlightColor="props.highlightColor">
    <div class="info-panel">
      <template v-for="cell of props.data">
        <div class="cell-title">{{ cell.title }}</div>
        <div>{{ cell.content ?? "-" }}</div>
      </template>
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
  grid-template-columns: 1fr 1fr;
  font-family: "Comfortaa", cursive;
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

.cell-title {
  text-transform: capitalize;
}
</style>
