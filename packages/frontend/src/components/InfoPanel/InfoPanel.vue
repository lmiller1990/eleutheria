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
  <div class="info-wrapper flex flex-col items-center">
    <div class="flex w-100 items-center">
      <div class="highlight highlight-left" :style="highlightStyle" />
      <h4 class="panel-title">{{ panelTitle }}</h4>
      <div class="highlight" :style="highlightStyle" />
    </div>
    <div class="info-content w-100">
      <slot />
    </div>
  </div>
</template>

<style>
@import "../../index.css";
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../shared.scss";

$border: 3px;

.info-content {
  padding: 10px 20px; // 0 50px;
  font-size: 1.5rem;
}

.info-wrapper {
  padding: 10px 0 20px 0;
  color: white;
  background: $bg;
  border: $border solid transparent;
}

.panel-title {
  background: $bg;
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
