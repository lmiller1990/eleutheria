<script lang="ts" setup>
import { computed } from "vue";
import type { InfoPanelProps } from "./types";

const highlightStyle = computed(() => {
  return {
    background: props.highlightColor ?? "yellow",
  };
});

const props = defineProps<InfoPanelProps>();
</script>

<template>
  <div class="info-wrapper bg-zinc-700 flex flex-col items-center">
    <div class="flex w-full items-center">
      <div class="highlight highlight-left" :style="highlightStyle" />
      <h4 class="panel-title bg-zinc-700">{{ panelTitle }}</h4>
      <div class="highlight" :style="highlightStyle" />
    </div>
    <div class="info-content w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../shared.scss";

$border: 3px;

.info-content {
  padding: 10px 20px;
  font-size: 1.5rem;
}

.info-wrapper {
  padding: 10px 0 20px 0;
  color: white;
  border: $border solid transparent;
}

.panel-title {
  font-size: 1.2rem;
  white-space: nowrap;
}

.highlight {
  background: yellow;
  height: 5px;
  width: 100%;
  margin: 0 5px;
}

.highlight-left {
  width: 50px;
}
</style>
