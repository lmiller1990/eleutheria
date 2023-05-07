<script lang="ts" setup>
import { useQuery } from "@urql/vue";
import { useRouter } from "vue-router";
import { SummaryScreenContainer_GetSummaryDocument } from "../../../../generated/graphql";

const props = defineProps<{
  songSummaryId: number;
}>();

const router = useRouter();

useQuery({
  query: SummaryScreenContainer_GetSummaryDocument,
  variables: { id: props.songSummaryId },
}).then(() => {
  router.push({ path: "/summary", query: { id: props.songSummaryId } });
});
</script>

<template>
  <div />
</template>
