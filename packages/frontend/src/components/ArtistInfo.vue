<script lang="ts" setup>
import ArtistInfoCell from "./ArtistInfoCell.vue";

const props = defineProps<{
  artist: string;
}>();

</script>

<template>
  <div :class="`w-full bg-zinc-700 border-2 flex flex-col items-center justify-between text-white p-4`">
    <div class="flex flex-col w-full">
      <ArtistInfoCell :text="props.artist" />
      <ArtistInfoCell :text="props.artist" />
      <ArtistInfoCell :text="props.artist" />
    </div>
  </div>
</template>
