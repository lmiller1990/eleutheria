<script lang="ts" setup>
// import type { PlainPanelProps } from "./types";

// const props = defineProps<PlainPanelProps>();
</script>

<template>
  <div class="plain-panel-wrapper flex items-center justify-center text-white">
    <slot />
  </div>
</template>

<style scoped lang="scss">
@import "../../shared.scss";

.plain-panel-wrapper {
  background: $bg;
}
</style>
