<script lang="ts" setup>
const props = defineProps<{
  label: string;
  data: {
    name: string;
    socials: Array<{
      social: string;
      link: string;
    }>;
  };
}>();

const icons = new Map([
  [
    "youtube",
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Youtube_colored_svg-1024.png",
  ],
  [
    "twitter",
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter3_colored_svg-1024.png",
  ],
  [
    "website",
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter3_colored_svg-1024.png",
  ],
  [
    "soundcloud",
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter3_colored_svg-1024.png",
  ],
  [
    "github",
    "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Twitter3_colored_svg-1024.png",
  ],
]);
</script>

<template>
  <div class="mb-2">
    <div class="text-xs">{{ props.label }}</div>
    <div class="flex justify-between">
      <div class="text-lg">{{ props.data.name }}</div>
      <div class="h-6 flex">
        <a
          v-for="{ social, link } of props.data.socials"
          :key="link"
          target="_blank"
          :href="link"
          class="h-full ml-1"
        >
          <img :src="icons.get(social)" class="h-full" />
        </a>
      </div>
    </div>
  </div>
</template>
