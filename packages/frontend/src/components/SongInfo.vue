<script lang="ts" setup>
import { computed } from "vue";
import SongInfoCell from "./SongInfoCell.vue";

const props = defineProps<{
  best: string | string;
  worldRecord: string | string;
  notes: number | string;
  duration: string | string;
  bpm: number | string;
}>();
</script>

<template>
  <div class="">
    <div class="song-info short:hidden">
      <SongInfoCell title="Best" :datum="props.best" />
      <SongInfoCell title="World #1" :datum="props.worldRecord" />
      <SongInfoCell title="Notes" :datum="props.notes" />
      <SongInfoCell title="Duration" :datum="props.duration" />
    </div>

    <div class="song-info-small tall:hidden flex justify-end">
      <div class="grid grid-cols-2 w-3/4">
        <SongInfoCell title="Best" :datum="props.best" />
        <SongInfoCell class="ml-4" title="Notes" :datum="props.notes" />
        <SongInfoCell title="Duration" :datum="props.duration" />
      </div>
    </div>
  </div>
</template>
