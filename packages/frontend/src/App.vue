<script lang="ts" setup>
import { useModal } from "./composables/modal";

const modal = useModal();
</script>

<template>
  <div
    id="modal-overlay"
    class="modal absolute h-screen w-screen flex items-center justify-center"
    :class="{
      'modal-show': modal.show.value,
      'modal-hide': !modal.show.value,
    }"
    @click="modal.hideModal"
  >
    <component
      v-if="modal.show.value"
      class="h-fit p-8"
      :is="modal.component.value"
      @click.stop
    />
  </div>

  <RouterView />
</template>

<style>
html,
body,
#app {
  background: #828282;
  height: 100%;
  @apply h-screen;
}

.modal {
  background: rgba(86, 88, 105, 0.5);
}

.modal-show {
  @apply opacity-100 z-50 scale-100;
  transform: scale(1);
}

.modal-hide {
  @apply opacity-0 -z-50 scale-90;
}

.modal {
  transition: all 0.1s ease;
}

.zoom-out {
  filter: blur(5px) grayscale(50%);
  transform: scale(0.98);
}

.klee-one {
  font-family: Klee;
}
</style>
