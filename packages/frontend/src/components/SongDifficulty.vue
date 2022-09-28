<template>
  <ul class="grid grid-row-gap-s grid-rows-repeat-3 upcase">
    <li
      class="flex space-between padding-s rounded-border-s"
      v-for="(chart, idx) of props.charts"
      :key="chart.difficulty"
      :class="[
        getDifficultyClass(chart.difficulty),
        { 'selected-difficulty': idx === props.selected },
      ]"
    >
      <div>{{ chart.difficulty }}</div>
      <div>{{ chart.level }}</div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Difficulty } from "@packages/shared";
import { difficulties } from "../shared";
import type { Chart } from "../types";

const getDifficultyClass = (diff: string) => {
  if (!(diff in difficulties)) {
    throw Error(`Unexpected difficulty: ${diff}`);
  }
  return difficulties[diff as Difficulty];
};

const props = defineProps<{
  selected: number;
  charts: Chart[];
}>();
</script>

<style scoped>
.selected-difficulty {
  box-shadow: 0px 0px 4px 4px goldenrod;
}
</style>
