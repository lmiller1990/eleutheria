<script lang="ts" setup>
import type { NonGameplayScreenProps } from "./types";
import { Logo } from "./Logo";
import { useModal } from "../../composables/modal";

const props = defineProps<NonGameplayScreenProps>();

const modal = useModal();
</script>

<template>
  <div
    class="flex flex-col outer items-center w-full h-full"
    :class="{ 'zoom-out': modal.show.value, [props.wrapperClass ?? '']: true }"
  >
    <nav class="bg-zinc-700 w-full text-white flex justify-center title-nav">
      <div class="max-width w-full flex justify-center items-center klee-one">
        <Logo />
        <div class="klee-one pb-1 ml-2 screen-title">
          {{ props.screenTitle }}
        </div>
      </div>
    </nav>

    <div class="screen-content max-width w-full h-full flex items-center">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.title-nav {
  height: 54px;
  margin-top: 25px;
}

.screen-content {
  margin: 30px;
  max-height: 768px;
}

.max-width {
  @apply max-w-3xl;
}

.screen-title {
  font-size: 35px;
}
</style>
