<script lang="ts" setup>
import { gql } from "@urql/core";
import { useQuery } from "@urql/vue";
import { OptionsModalDocument } from "../../generated/graphql";
import { OptionsModalWrapper } from "./OptionsModal";

gql`
  query OptionsModal {
    noteSkins {
      id
      name
      css
    }
    covers {
      id
      name
      thumbnailColor
      css
      code
    }
  }
`;

const { data } = useQuery({ query: OptionsModalDocument });
</script>

<template>
  <OptionsModalWrapper v-if="data" :gql="data" />
</template>
