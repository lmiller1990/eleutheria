<template>
  <li class="flex justify-between">
    <div>{{ props.window }}</div>
    <div>{{ data.count }}</div>
  </li>
</template>

<script setup lang="ts">
import { TimingTypeSummary } from "@packages/engine";

const props = defineProps<{
  window: string;
  data: TimingTypeSummary;
}>();
</script>
