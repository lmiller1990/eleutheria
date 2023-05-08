<script lang="ts" setup>
import SongInfoCell from "./SongInfoCell.vue";

const props = defineProps<{
  best: string | string;
  notes: number | string;
  duration: string | string;
  bpm: number | string;
}>();
</script>

<template>
  <div class="tall:h-[336px]">
    <div class="song-info short:hidden">
      <SongInfoCell title="Best" :datum="props.best" />
      <SongInfoCell title="Notes" :datum="props.notes" />
      <SongInfoCell title="Duration" :datum="props.duration" />
      <SongInfoCell title="BPM" :datum="props.bpm" />
    </div>

    <div class="song-info-small tall:hidden flex justify-end">
      <div class="grid grid-cols-2 w-3/4">
        <SongInfoCell title="Best" :datum="props.best" />
        <SongInfoCell class="ml-4" title="Notes" :datum="props.notes" />
        <SongInfoCell title="Duration" :datum="props.duration" />
        <SongInfoCell class="ml-4" title="BPM" :datum="props.bpm" />
      </div>
    </div>
  </div>
</template>
