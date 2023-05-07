<script lang="ts" setup>
import type { SongDifficulty } from "../types";

defineProps<{
  difficulty: SongDifficulty;
}>();
</script>

<template>
  <div
    class="capitalize text-xl difficulty-item w-full flex justify-between"
    :class="difficulty.name"
  >
    <div class="difficulty-label p-3">
      {{ difficulty.name }}
    </div>

    <div
      class="level h-100 flex justify-center"
      :class="`${difficulty.name}-level`"
    >
      <div class="flex items-center justify-center">
        {{ difficulty.level }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.difficulty-item {
  cursor: pointer;
}

.level {
  width: 52px;
}

.basic {
  background: #12c32e;

  &:hover {
    background: #18f13b;

    .basic-level {
      background: #12c32e;
    }
  }
}

.basic-level {
  background: #119926;
}

.standard {
  background: #fcff57;

  &:hover {
    background: #fdffa1;

    .standard-level {
      background: #dde042;
    }
  }
}

.standard-level {
  background: #c8cc14;
}

.expert {
  background: #d91c1c;

  &:hover {
    background: #ff3434;

    .expert-level {
      background: #d91c1c;
    }
  }
}

.expert-level {
  background: #991111;
}
</style>
