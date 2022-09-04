<template>
  <div v-if="result.fetching.value">Loading...</div>

  <div v-else-if="result.error.value">Oh no... {{ result.error }}</div>

  <div v-else>
    <ul v-if="result.data.value">
      <li v-for="book of result.data.value.app.books">{{ book.title }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useQuery, gql } from "@urql/vue";
import { GetBooksDocument } from "./generated/graphql";

gql`
  query GetBooks {
    app {
      books {
        title
      }
    }
  }
`;

const result = useQuery({
  query: GetBooksDocument,
});
</script>
