<template>
  <ul class="grid grid-row-gap-s grid-rows-repeat-3 upcase">
    <li
      class="flex space-between padding-s rounded-border-s"
      v-for="chart of props.charts"
      :key="chart.difficulty"
      :class="difficulties[chart.difficulty]"
    >
      <div>{{ chart.difficulty }}</div>
      <div>{{ chart.level }}</div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Chart, Difficulty } from "@packages/types";
import { difficulties } from "../shared";

const props = defineProps<{
  selected: Difficulty;
  charts: Chart[];
}>();
</script>
