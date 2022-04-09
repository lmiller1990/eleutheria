<template>
  <div class="h-100 flex items-center justify-center">
    <img class="rounded-border-m" :src="banner" />
    {{ banner }}
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  banner: string;
}>();
</script>

<style scoped>
img {
  aspect-ratio: 16/9;
}
</style>
