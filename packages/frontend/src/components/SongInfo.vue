<template>
  <table>
    <tr>
      <td>Tap Notes</td>
      <td>{{ props.chartSummary.totalNotes }}</td>
    </tr>

    <tr>
      <td>Hold Notes</td>
      <td>{{ props.chartSummary.holdNotes }}</td>
    </tr>

    <tr>
      <td>Duration</td>
      <td>{{ durationSeconds }}</td>
    </tr>

    <tr>
      <td>Chords</td>
      <td />
    </tr>

    <tr v-for="{ key, num } of keys" :key="key">
      <td>{{ num }} Notes</td>
      <td>{{ props.chartSummary.chords[key] }}</td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import type { ChartSummary } from "@packages/types/src";

const keys = [
  { key: "twoNoteCount", num: "2" },
  { key: "threeNoteCount", num: "3" },
  { key: "fourNoteCount", num: "4" },
  { key: "fiveNoteCount", num: "5" },
  { key: "sixNoteCount", num: "6" },
] as const;

const props = defineProps<{
  chartSummary: ChartSummary;
  durationSeconds: string;
}>();
</script>
