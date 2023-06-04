<script lang="ts" setup>
import ArtistInfoCell from "./ArtistInfoCell.vue";

interface Creator {
  name: string;
  socials: Array<{
    social: string;
    link: string;
  }>;
}

const props = defineProps<{
  composer: Creator;
  stepChart: Creator;
}>();
</script>

<template>
  <div
    :class="`w-full bg-zinc-700 border-2 flex flex-col items-center justify-between text-white p-4`"
  >
    <div class="flex flex-col w-full">
      <ArtistInfoCell label="Artist" :data="props.composer" />
      <ArtistInfoCell label="Chart" :data="props.stepChart" />
    </div>
  </div>
</template>
