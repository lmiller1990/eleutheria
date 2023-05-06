<script lang="ts" setup>
const props = defineProps<{ title: string; datum: string | number }>();
</script>

<template>
  <div class="song-info-wrapper mb-4 short:mb-2 flex flex-col items-end">
    <div
      class="song-info-label text-black text-2xl short:text-lg uppercase font-bold"
    >
      {{ props.title }}
    </div>
    <div class="song-info-data text-white text-4xl short:text-xl font-mono">
      {{ props.datum }}
    </div>
  </div>
</template>
