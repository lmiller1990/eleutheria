<script lang="ts" setup>
import Gameplay from "./components/Gameplay/Gameplay.vue";
import "../../style.css";
</script>

<template>
  <Suspense>
    <template #default>
      <div id="game-app">
        <!-- <Gameplay :__testingDoNotStartSong="true"/> -->
        <Gameplay />
      </div>
    </template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>
