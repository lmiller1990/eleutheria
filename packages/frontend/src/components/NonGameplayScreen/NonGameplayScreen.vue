<script lang="ts" setup>
import type { NonGameplayScreenProps } from "./types";

const props = defineProps<NonGameplayScreenProps>();
</script>

<template>
  <div class="flex flex-col outer items-center w-full h-full">
    <nav class="bg-zinc-700 w-full text-white flex justify-center">
      <div class="max-1024 screen-title w-full flex flex-col justify-center">
        {{ props.screenTitle }}
      </div>
    </nav>

    <div class="screen-content max-1024 w-full h-full">
      <slot />
    </div>
  </div>
</template>

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

.screen-title {
  text-align: right;
  height: 54px;
  font-size: 2rem;
  // text-transform: uppercase;
  font-weight: bold;
  padding: 0 40px;
}
</style>
