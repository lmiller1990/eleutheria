<script lang="ts" setup>
import EditorScreenContainer from "./EditorScreenContainer.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <EditorScreenContainer />
    </template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>
