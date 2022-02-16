<template>
  <div class="flex items-center flex-col">
    <ul class="w-40 mt-48 mb-24">
      <TimingSummary
        v-for="win of [...windows, 'miss']"
        :key="win"
        :window="win"
        :data="data(win)"
      />
    </ul>

    <button @click="goNext">Continue</button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useSummaryStore } from "../../stores/summary";
import { windows } from "../gameplay/config";
import TimingSummary from "./TimingSummary.vue";

const summaryStore = useSummaryStore();

function data(win: string) {
  const d = summaryStore.summary?.timing?.[win];

  if (!d) {
    throw Error(`Could not find data for ${win} in summary`);
  }

  return d;
}

if (!summaryStore.summary) {
  throw Error(`Summary not found for song!`);
}

const router = useRouter();

function goNext() {
  router.push("/");
}
</script>
