<script lang="ts" setup>
import SummaryScreenContainer from "./SummaryScreenContainer.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <SummaryScreenContainer />
    </template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>
