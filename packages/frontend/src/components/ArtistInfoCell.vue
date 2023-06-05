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

const icons = new Map(
  ["youtube", "twitter", "website", "soundcloud", "github"].map((social) => [
    social,
    `${import.meta.env.VITE_CDN_URL}/${social}.png`,
  ])
);
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
          <img :src="icons.get(social)" class="h-full rounded" />
        </a>
      </div>
    </div>
  </div>
</template>
