<template>
  {{ props.song.title }}
</template>

<script lang="ts" setup>
import type { Song } from "../types";

const props = defineProps<{
  song: Song;
  selected: boolean;
}>();
</script>
