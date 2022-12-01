<script lang="ts" setup>
const props = defineProps<{
  level?: number;
  file: string;
}>();

const file = `${import.meta.env.VITE_CDN_URL}/${props.file}.png`;
const stars = `${import.meta.env.VITE_CDN_URL}/stars.svg`;
</script>

<template>
  <div class="relative">
    <img
      class="border border-2 border-white mb-2"
      :src="file"
      :style="`background-image: url(${stars})`"
      ref="imgRef"
    />
    <div
      v-if="props.level"
      class="bg-zinc-700 text-white absolute top-2 right-2 h-10 w-10 text-xl font-mono flex items-center justify-center"
    >
      {{ props.level.toString().padStart(2, "0") }}
    </div>
  </div>
</template>
