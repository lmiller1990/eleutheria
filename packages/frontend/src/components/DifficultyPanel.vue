<script lang="ts" setup>
import type { SongDifficulty } from "../types";
import DifficultyItem from "./DifficultyItem.vue";
import Triangle from "./Triangle.vue";

defineProps<{
  difficulties: SongDifficulty[];
  selectedIndex?: number;
}>();

const emit = defineEmits<{
  (event: "selected", index: number): void;
}>();
</script>

<template>
  <div class="difficulty-panel">
    <div
      v-for="(difficulty, index) of difficulties"
      class="row flex items-center"
    >
      <div class="cursor flex justify-center">
        <Triangle
          v-if="selectedIndex !== undefined && index === selectedIndex"
        />
      </div>
      <DifficultyItem
        :key="difficulty.name"
        :difficulty="difficulty"
        @click="emit('selected', index)"
      />
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
