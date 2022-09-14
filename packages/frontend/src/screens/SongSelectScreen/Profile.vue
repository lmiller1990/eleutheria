<script lang="ts" setup>
import { gql } from "@urql/core";
import { useMutation, useQuery } from "@urql/vue";
import { useModal } from "../../composables/modal";
import {
  Profile_SignOutDocument,
  Profile_ViewerDocument,
} from "../../generated/graphql";
import Button from "../../components/Button.vue";

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

async function handleSignOut() {
  await signOut.executeMutation({});
  modal.hideModal();
}
</script>

<template>
  <div class="profile w-full h-full text-2xl">
    <div class="flex justify-between items-center">
      <h1>Profile for {{ viewerQuery.data?.value?.viewer?.username }}</h1>
      <Button @click="handleSignOut">Sign Out</Button>
    </div>

    <div class="flex justify-center items-center m-12">
      TODO: Useful information.
    </div>
  </div>
</template>

<style scoped>
/* Styles */
.profile {
  background: #373737;
  @apply max-w-3xl text-white uppercase;
}
</style>
