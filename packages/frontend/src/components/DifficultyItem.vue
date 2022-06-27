<script lang="ts" setup>
import type { SongDifficulty } from '../types'

defineProps<{
  difficulty: SongDifficulty
}>()
</script>

<template>
  <div class="difficulty-item w-100 align-center flex space-between" :class="difficulty.name">
    <div class="difficulty-label">
      {{ difficulty.name }}
    </div>

    <div class="level" :class="`${difficulty.name}-level`">
      {{ difficulty.level }}
    </div>
  </div>
</template>

<style>
@import "../index.css";
@import "../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
.difficulty-item {
  padding-left: 30px;
  text-transform: capitalize;
  font-family: 'Sansation', sans-serif;
  font-weight: bold;
  font-size: 1.5rem;
  cursor: pointer;
}


.difficulty-label, .level {
  padding: 10px;
}

.basic {
  background: #12C32E;

  &:hover {
    background: #18F13B;

    .basic-level {
      background: #12C32E;
    }
  }
}

.basic-level {
  background: #119926;
}

.standard {
  background: #FCFF57;

  &:hover {
    background: #FDFFA1;

    .standard-level {
      background: #dde042;
    }
  }
}

.standard-level {
  background: #C8CC14;
}

.expert {
  background: #D91C1C;

  &:hover {
    background: #FF3434;

    .expert-level {
      background: #D91C1C;
    }
  }
}

.expert-level {
  background: #991111;
}

.level {
  width: 60px;
}
</style>

