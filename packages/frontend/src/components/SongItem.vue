<template>
  <div
    class="outer w-full rounded-border-s flex items-center padding-horizontal-s"
  >
    <div>
      {{ props.song.title }}
    </div>

    <div>
      {{ props.song.artist }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Song } from "../types";

const props = defineProps<{
  song: Song;
}>();
</script>

<style scoped>
.outer {
  outline: 2px solid #f3b497;
  outline-offset: -5px;
  background: rgb(229, 231, 235, 0.75); /* gray-1 */
}
</style>
