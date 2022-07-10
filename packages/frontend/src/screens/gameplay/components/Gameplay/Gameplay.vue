<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { GameplayProps } from "./types";

const props = defineProps<GameplayProps>();

const root = ref<HTMLDivElement>();

onMounted(async () => {
  if (!root.value) {
    return;
  }

  const { start } = await import("../../gameplay");

  start(root.value, {
    ...props.startGameArgs,
  });
});
</script>

<template>
  <div ref="root" class="max-w-l" />
</template>

<style>
@import "../../../../index.css";
@import "../../../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../../../shared.scss";
</style>
