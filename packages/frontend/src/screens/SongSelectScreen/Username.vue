<script lang="ts" setup>
import { gql } from "@urql/core";
import { useQuery } from "@urql/vue";
import { computed } from "vue";
import { useModal } from "../../composables/modal";
import { Username_ViewerDocument } from "../../generated/graphql";

gql`
  query Username_Viewer {
    viewer {
      id
      email
    }
  }
`;

const viewerQuery = useQuery({ query: Username_ViewerDocument });

const viewer = computed(() => {
  return viewerQuery.data?.value?.viewer ?? null;
});

const modal = useModal();

function handleAuthenticate() {
  modal.showModal("signIn");
}

function handleSignOut() {
  modal.showModal("signOut");
}
</script>

<template>
  <button class="button" v-if="viewerQuery.fetching.value">-</button>
  <button
    class="button"
    v-else-if="viewer?.email"
    data-cy="viewer"
    @click="handleSignOut"
  >
    {{ viewer.email }}
  </button>
  <button class="button" v-else data-cy="guest" @click="handleAuthenticate">
    Guest
  </button>
</template>

<style scoped>
.button {
  @apply text-white px-3 h-8 bg-zinc-700;
}
</style>
