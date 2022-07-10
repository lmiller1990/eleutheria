<script lang="ts" setup>
import GameplayScreenContainer from "./GameplayScreenContainer.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <GameplayScreenContainer />
    </template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>
