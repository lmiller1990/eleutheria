<template>
  <div
    class="shadow-md w-96 h-16 my-2 p-2 flex items-center rounded-md border-2 bg-white"
    :class="{
      'border-red-500': props.selected,
      'border-white': !props.selected,
    }"
  >
    <div
      :class="color"
      class="w-8 flex items-center justify-center rounded-md mr-2"
    >
      {{ level }}
    </div>
    <div>
      {{ props.song.title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Difficulty } from "@packages/types";
import type { Song } from "../types";

const props = defineProps<{
  song: Song;
  selectedDifficulty: Difficulty;
  selected: boolean;
}>();

const level = computed(
  () =>
    props.song.charts.find((x) => x.difficulty === props.selectedDifficulty)
      ?.level
);

const color = computed(() => {
  if (props.selectedDifficulty === "basic") {
    return "bg-green-300";
  }

  if (props.selectedDifficulty === "standard") {
    return "bg-blue-300";
  }

  return "bg-red-300";
});
</script>
