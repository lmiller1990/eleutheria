<script lang="ts" setup>
import {
  createClient,
  provideClient,
  dedupExchange,
  fetchExchange,
} from "@urql/vue";
import { devtoolsExchange } from '@urql/devtools';
import { cacheExchange } from "@urql/exchange-graphcache";
import { useModal } from "./composables/modal";

const client = createClient({
  url: "/graphql",
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      keys: {
        Viewer: () => null,
        App: () => null
      },
    }),
    fetchExchange,
  ],
});

provideClient(client);

const modal = useModal();
</script>

<template>
  <div
    v-if="modal.show.value"
    class="modal absolute h-screen w-screen flex items-center justify-center z-40"
    @click="modal.hideModal"
  >
    <component class="h-fit p-8" :is="modal.component.value" @click.stop />
  </div>

  <RouterView />
  <!-- <Query /> -->
</template>

<style>
html,
body,
#app {
  height: 100%;
  @apply h-screen;
}

.modal {
  background: rgba(86, 88, 105, 0.5);
}
</style>
