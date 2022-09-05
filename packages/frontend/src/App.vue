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
@import "../../breeze-css/dist/breeze.css";
body {
  height: 100%;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
