<script lang="ts" setup>
import type { SongInfoPanelProps } from "./types";
import InfoPanel from "../InfoPanel";

const props = defineProps<SongInfoPanelProps>();
</script>

<template>
  <InfoPanel panelTitle="Stats" :highlightColor="props.highlightColor">
    <div class="flex justify-center">
      <table>
        <tr v-for="cell of props.data">
          <td class="cell-title">{{ cell.title }}</td>
          <td class="cell-data">{{ cell.content ?? "-" }}</td>
        </tr>
      </table>
    </div>
  </InfoPanel>
</template>

<style>
@import "../../index.css";
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../shared.scss";

table {
  table-layout: fixed;
}

$border: 3px;

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
  padding-right: 30px;
}

.cell-data {
  overflow: hidden;
  width: 80px;
}
</style>
