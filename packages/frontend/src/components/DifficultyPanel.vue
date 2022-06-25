<script lang="ts" setup>
import type { SongDifficulty } from "../types";
import DifficultyItem from "./DifficultyItem.vue";
import Triangle from "./Triangle.vue";

defineProps<{
  difficulties: SongDifficulty[];
  selectedIndex: number;
}>();
</script>

<template>
  <div class="difficulty-panel">
    <div v-for="(difficulty, idx) of difficulties" class="row flex items-center">
      <div class="cursor flex justify-center">
        <Triangle v-if="idx === selectedIndex" />
      </div>
      <DifficultyItem :key="difficulty.name" :difficulty="difficulty" />
    </div>
  </div>
</template>

<style>
@import "../index.css";
@import "../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
.difficulty-panel {
  display: grid;
  row-gap: 14px;
}

.cursor {
  width: 50px;
}
</style>
