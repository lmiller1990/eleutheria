<script lang="ts" setup>
import { gql } from "@urql/core";
import { useMutation, useQuery } from "@urql/vue";
import { useModal } from "../../composables/modal";
import {
  Profile_SignOutDocument,
  Profile_ViewerDocument,
} from "../../generated/graphql";
import Button from "../../components/Button.vue";
import { useEmitter } from "../../composables/emitter";

gql`
  query Profile_Viewer {
    viewer {
      username
    }
  }
`;

gql`
  mutation Profile_SignOut {
    signOut {
      viewer {
        id
        username
      }
    }
  }
`;

const viewerQuery = useQuery({ query: Profile_ViewerDocument });
const signOut = useMutation(Profile_SignOutDocument);
const modal = useModal();
const emitter = useEmitter();

async function handleSignOut() {
  await signOut.executeMutation({});
  emitter.emit("authentication:changed");
  modal.hideModal();
}
</script>

<template>
  <div class="bg-zinc-700 w-full h-full max-w-3xl text-white">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl">{{ viewerQuery.data?.value?.viewer?.username }}</h1>
      <Button @click="handleSignOut">Sign Out</Button>
    </div>

    <div class="flex justify-center items-center m-12 text-sm">
      Detailed user profile coming soon!
    </div>
  </div>
</template>
