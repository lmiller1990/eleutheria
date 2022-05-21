<template>
  <div id="game-app" ref="root" class="max-w-l" />
</template>

<script lang="ts" setup>
import type { Summary } from "@packages/engine";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useSummaryStore } from "../../stores/summary";
import "../../style.css";

const router = useRouter();

function songCompleted(summary: Summary) {
  return;
  const summaryStore = useSummaryStore();
  summaryStore.setSummary(summary);
  router.push("/summary");
}

const root = ref<HTMLDivElement>();

onMounted(async () => {
  if (!root.value) {
    throw Error("Could not find root node for game");
  }

  const { start } = await import("./gameplay");

  start(root.value, songCompleted);
});
</script>
