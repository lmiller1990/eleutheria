<script lang="ts" setup>
const props = defineProps<{
  text: string
}>()

const icons = [
  "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter3_colored_svg-1024.png",
  "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Youtube_colored_svg-1024.png",
];
</script>

<template>
  <div class="mb-2">
    <div class="text-xs">Song</div>
    <div class="flex justify-between">
      <div class="text-lg">{{ props.text }}</div>
      <div class="h-6 flex">
        <img
          v-for="icon of icons"
          :src="icon"
          :key="icon"
          class="h-full ml-1"
        />
      </div>
    </div>
  </div>
</template>
