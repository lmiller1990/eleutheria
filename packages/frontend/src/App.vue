<script lang="ts" setup>
import { createClient, provideClient } from "@urql/vue";
import { useModal } from "./composables/modal";

const client = createClient({
  url: "/graphql",
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
    <component class="h-fit" :is="modal.component.value" @click.stop />
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
