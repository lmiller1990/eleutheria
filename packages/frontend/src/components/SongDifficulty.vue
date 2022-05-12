<template>
  <ul class="upcase">
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
import type { Difficulty } from "@packages/types/src";
import { difficulties } from "../shared";
import type { Chart } from "../types";

const props = defineProps<{
  selected: Difficulty;
  charts: Chart[];
}>();
</script>
