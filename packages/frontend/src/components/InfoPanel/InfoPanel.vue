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

    <slot />
  </div>
</template>

<style>
@import "../../index.css";
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../shared.scss";

$border: 3px;
$bg: #373737;

.info-wrapper {
  padding: 10px 0 20px 0;
  background: $bg;
  border: $border solid transparent;
}

.panel-title {
  background: $bg;
  color: white;
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
