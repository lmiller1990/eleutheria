<script lang="ts" setup>
import PlaySymbol from "../PlaySymbol.vue";
import type { Props } from "./types";

defineProps<Props>();
</script>

<template>
  <div class="h-100 w-100 align-center song-title-banner" data-cy="song-tile">
    <div class="relative song-img-wrapper flex justify-center items-center" data-cy="image">
      <img class="song-img relative" :src="imgSrc" />
      <PlaySymbol class="play-symbol" :class="{ 'opacity-1': selected }" data-cy="play-symbol" />
    </div>

    <div class="song-title text-white flex items-center justify-center">
      {{ songTitle }}
    </div>
  </div>
</template>

<style>
@import "../../index.css";
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
$img-height: 75%;

.play-symbol {
  position: absolute;
}

.song-title-banner {
  background: #373737;
  font-family: "Sansation", sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
}

.song-title {
  height: calc(100% - $img-height);
  padding: 10px 0;
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
}

.opacity-1 {
  opacity: 1 !important;
}
</style>
