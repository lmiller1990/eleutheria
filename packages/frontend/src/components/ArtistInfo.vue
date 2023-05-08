<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  artist: string;
}>();

const src = computed(
  () => `${import.meta.env.VITE_CDN_URL}/${props.artist.toLowerCase()}.png`
);

const icons = [
  "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter3_colored_svg-1024.png",
  "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Youtube_colored_svg-1024.png",
];
</script>

<template>
  <div
    :class="`w-full bg-zinc-700 border-2 h-full flex flex-col items-center justify-between text-white p-4`"
  >
    <img :src="src" class="rounded-full h-32 tall:h-full tall:rounded-lg" />
    <div class="flex items-center justify-between w-full">
      <div class="text-md tall:text-xl py-2">
        {{ props.artist }}
      </div>
      <div class="h-6 flex items-center">
        <img
          v-for="icon of icons"
          :src="icon"
          :key="icon"
          class="h-full ml-1"
        />
      </div>
    </div>
    <p class="text-justify text-xs">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </div>
</template>
