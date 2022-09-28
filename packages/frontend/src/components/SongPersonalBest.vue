<template>
  <table>
    <tr>
      <td>Best</td>
      <td>{{ formatPercent(props.personalBest.percent) }}</td>
    </tr>

    <tr>
      <td>Date</td>
      <td>{{ formatDate(props.personalBest.date) }}</td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
import type { PersonalBest } from "@packages/shared";

function formatDate(string: string) {
  return new Date(string).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPercent(percent: number) {
  return `${percent.toPrecision(4).toString()}%`;
}

const props = defineProps<{
  personalBest: PersonalBest;
}>();
</script>
