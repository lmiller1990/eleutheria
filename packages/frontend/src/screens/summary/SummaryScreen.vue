<script lang="ts" setup>
import { SummaryWrapper } from "./SummaryWrapper";
</script>

<template>
  <Suspense>
    <template #default>
      <SummaryWrapper />
    </template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>
