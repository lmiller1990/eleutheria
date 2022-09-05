<script lang="ts" setup>
import { createClient, provideClient } from "@urql/vue";
import Query from "./Query.vue";

const client = createClient({
  url: "http://localhost:8000/graphql",
});

provideClient(client);
</script>

<template>
  <RouterView />
  <Query />
</template>

<style>
html, body, #app {
  height: 100%;
  @apply h-screen;
}
</style>
