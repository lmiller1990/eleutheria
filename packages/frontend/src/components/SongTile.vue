<script lang="ts" setup>
import { computed } from "vue";
import { onMounted, ref } from "vue";
import { useImageLoader, ImageLoader } from "../composables/imageLoader";

const props = defineProps<{
  file: string;
  songTitle: string;
  artist: string;
  selected: boolean;
}>();

const className = computed(() =>
  props.selected ? "border-white" : "border-black"
);

const loader = useImageLoader("songSelectScreen") as ImageLoader;

const imgRef = ref<HTMLImageElement>();

onMounted(() => {
  loader.addLoader(imgRef.value!);
});

const src = computed(() => `${import.meta.env.VITE_CDN_URL}/${props.file}.png`);
</script>

<template>
  <button
    :class="`w-full bg-zinc-700 ${className} border-2 h-20 flex items-center justify-between`"
  >
    <img class="h-full" :src="src" ref="imgRef" />
    <div class="flex flex-col items-end p-2">
      <div class="text-white text-2xl">{{ props.songTitle }}</div>
      <div class="text-gray-300 text-xl">{{ props.artist }}</div>
    </div>
  </button>
</template>
