<template>
  <ul class="grid grid-row-gap-s grid-rows-repeat-3 upcase">
    <li
      class="flex space-between padding-s rounded-border-s"
      v-for="chart of props.charts"
      :key="chart.difficulty"
      :class="{
        'blue-2': chart.difficulty === 'basic',
        'red-2': chart.difficulty === 'standard',
        'green-2': chart.difficulty === 'expert'
      }"
    >
      <div>{{ chart.difficulty }}</div>
      <div>{{ chart.level }}</div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Chart, Difficulty } from '@packages/types'

const props = defineProps<{
  selected: Difficulty
  charts: Chart[]
}>()
</script>