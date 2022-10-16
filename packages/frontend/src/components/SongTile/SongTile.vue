<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import type { Props } from "./types";

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: "selected"): void;
}>();

const pulseClass = ref<"pulse-initial" | "pulse-repeat" | "">("");

let timeoutId: number;

watchEffect(() => {
  if (!props.selected) {
    pulseClass.value = "";
    window.clearTimeout(timeoutId);
  }
});

function handleSelected() {
  emit("selected");

  if (props.selected) {
    return;
  }

  timeoutId = window.setTimeout(() => {
    pulseClass.value = "pulse-repeat";
  }, 750);
}
</script>

<template>
  <button
    class="w-full bg-zinc-700 border-black border-2 h-20 flex items-center justify-between"
    @click="handleSelected"
  >
    <img
      class="h-full"
      src="https://i1.sndcdn.com/artworks-I25aaV3g3bIRnsV2-jJchQg-t500x500.jpg"
    />
    <div class="flex flex-col items-end p-2">
      <div class="text-white text-2xl">{{ props.songTitle }}</div>
      <div class="text-gray-300 text-xl">{{ props.artist }}</div>
    </div>
  </button>
</template>

<style scoped></style>
