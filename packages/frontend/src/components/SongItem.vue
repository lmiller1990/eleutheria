<template>
  <div
    class="w-100 rounded-border-s flex items-center padding-horizontal-s"
    style="background: skyblue"
  >
    {{ props.song.title }}
  </div>
</template>

<script lang="ts" setup>
import type { Song } from "../types";

const props = defineProps<{
  song: Song;
}>();
</script>
