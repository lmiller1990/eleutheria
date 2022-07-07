<script lang="ts" setup>
import type { NonGameplayScreenProps } from "./types";

const props = defineProps<NonGameplayScreenProps>();
</script>

<template>
  <div class="flex flex-col outer w-100 items-center h-100">
    <nav class="screen-name w-100 text-white flex justify-center">
      <div class="max-1024 screen-title w-100 flex flex-col justify-center">
        {{ props.screenTitle }}
      </div>
    </nav>

    <div class="screen-content h-100 max-1024 w-100">
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

.screen-content {
  padding: 40px;
}

.max-1024 {
  max-width: 1024px;
}

.outer {
  padding: 25px 0;
}

.screen-name {
  background: #373737;
}

.screen-title {
  text-align: right;
  height: 54px;
  font-size: 2rem;
  text-transform: uppercase;
  font-weight: bold;
  padding: 0 40px;
}
</style>
