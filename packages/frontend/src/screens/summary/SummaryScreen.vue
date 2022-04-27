<template>
  <div class="flex items-center flex-col h-100">
    <table id="timing-table">
      <tr v-for="win of [...windows, 'miss']" :key="win">
        <td class="upcase" :class="`timing-${win}`">{{ win }}</td>
        <td>{{ data(win).count }}</td>
      </tr>
    </table>

    <button @click="goNext">Continue</button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useSummaryStore } from "../../stores/summary";
import { windows } from "../gameplay/config";

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

<style scoped>
#timing-table {
  font-family: "Comfortaa", cursive;
}
</style>
