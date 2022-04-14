<template>
  <table>
    <tr>
      <td>Tap Notes</td>
      <td>{{ props.chartSummary.tapNotes }}</td>
    </tr>

    <tr>
      <td>Hold Notes</td>
      <td>{{ props.chartSummary.holdNotes }}</td>
    </tr>

    <tr>
      <td>Duration</td>
      <td>{{ displayDuration(props.chartSummary.durationSeconds) }}</td>
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
import type { ChartSummary } from "@packages/types";

function displayDuration(seconds: number) {
  const s = (seconds % 60).toString().padStart(2, "0");
  const m = Math.floor(seconds / 60);
  return `${m}:${s}`;
}

const keys = [
  { key: "twoNoteCount", num: "2" },
  { key: "threeNoteCount", num: "3" },
  { key: "fourNoteCount", num: "4" },
  { key: "fiveNoteCount", num: "5" },
  { key: "sixNoteCount", num: "6" },
] as const;

const props = defineProps<{
  chartSummary: ChartSummary;
}>();
</script>
