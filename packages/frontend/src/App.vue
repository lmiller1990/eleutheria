<script lang="ts" setup>
import { createClient, provideClient } from "@urql/vue";
import { reactive } from "vue";
import { useModal } from "./composables/modal";

const client = createClient({
  url: "http://localhost:5566/graphql",
});

provideClient(client);

const modal = useModal();

const user = reactive({
  name: 'lachlan',
  password: '123'
})

async function createSession () {
  const res = await window.fetch("/api/set", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  console.log(await res.json())
}

async function handle () {
  const body = JSON.stringify(user)
  const res = await window.fetch("api/login", {
    method: "POST",
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  console.log(await res.json())
}
</script>

<template>
  <div
    v-if="modal.show.value"
    class="modal absolute h-screen w-screen flex items-center justify-center z-40"
    @click="modal.hideModal"
  >
    <component class="h-fit" :is="modal.component.value" @click.stop />
  </div>

  <button @click="createSession">Create</button>
  <form @submit.prevent="handle">
    <input v-model="user.name" />
    <input v-model="user.password" />
    <button>Submit</button>
  </form>

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
