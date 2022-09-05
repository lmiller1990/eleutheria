<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import PlaySymbol from "../PlaySymbol.vue";
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

  window.clearTimeout(timeoutId);

  pulseClass.value = "pulse-initial";

  timeoutId = window.setTimeout(() => {
    pulseClass.value = "pulse-repeat";
  }, 750);
}
</script>

<template>
  <div
    class="h-full w-full items-center song-title-banner"
    :class="{ selected }"
    data-cy="song-tile"
    @click="handleSelected"
  >
    <div
      class="relative song-img-wrapper flex justify-center items-center"
      data-cy="image"
    >
      <div
        class="song-img relative"
        :style="`background-image: url(${imgSrc})`"
      />
      <PlaySymbol
        class="play-symbol circle"
        :class="{ 'opacity-1': selected, [pulseClass]: true }"
        data-cy="play-symbol"
      />
    </div>

    <div class="song-title text-white flex items-center justify-center">
      {{ songTitle }}
    </div>
  </div>
</template>

<style scoped lang="scss">
$img-height: 75%;

.play-symbol {
  position: absolute;
  border-radius: 50%;
}

.song-title-banner,
.song-title {
  background: #373737;
}

.song-title-banner {
  box-sizing: border-box;
  font-size: 1.5rem;
  font-weight: bold;
  border: 5px solid transparent; // match background. TODO: share variable.
  clip-path: inset(0px 0px 0px 0px);
  position: relative;
  
  height: 100%;
  width: 100%;
}

.selected {
  position: relative;
  border: 5px solid white;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    z-index: 0;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    background-color: #399953;
    background-repeat: no-repeat;
    background-size: 50% 50%, 50% 50%;
    background-position: 0 0, 100% 0, 100% 100%, 0 100%;
    background-image: linear-gradient(#399953, #399953),
      linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33),
      linear-gradient(#377af5, #377af5);
    animation: rotate 4s linear infinite;
    border-radius: 50%;
    overflow: hidden;
    animation: spin 4s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    left: 6px;
    top: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    background: white;
    border-radius: 5px;
  }
}

.song-title {
  height: calc(100% - $img-height);
  padding: 10px 0;
  position: relative;
}

.song-img-wrapper {
  height: $img-height;
  cursor: pointer;
}

.song-img-wrapper:hover .play-symbol {
  opacity: 0.75;
}

.play-symbol {
  opacity: 0;
  transition: 200ms;
}

.song-img {
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
}

.opacity-1 {
  opacity: 1 !important;
}

$outline-color: white;
$outline-max: 0 0 5px 5px $outline-color;

@keyframes pulse-initial {
  0% {
    box-shadow: 0 0 0px 0px $outline-color;
  }

  50% {
    box-shadow: $outline-max;
  }

  100% {
    box-shadow: 0 0 2px 2px $outline-color;
  }
}

@keyframes pulse-repeat {
  0% {
    box-shadow: 0 0 2px 2px $outline-color;
  }

  50% {
    box-shadow: $outline-max;
  }

  100% {
    box-shadow: 0 0 2px 2px $outline-color;
  }
}

.circle {
  border-radius: 50%;
}

.pulse-initial {
  animation: pulse-initial 750ms;
}

.pulse-repeat {
  animation: pulse-repeat 750ms linear infinite;
}
</style>
