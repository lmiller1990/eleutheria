<script lang="ts" setup>
import { gql, useQuery } from "@urql/vue";
import { computed } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { SummaryScreenContainer_GetSummaryDocument } from "../../generated/graphql";
import { windowsWithMiss } from "../gameplay/gameConfig";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import PlainPanel from "../../components/PlainPanel";
import DifficultyItem from "../../components/DifficultyItem.vue";
import SongInfoPanel, { TableCell } from "../../components/SongInfoPanel";
import ScoreBadge from "../../components/ScoreBadge";
import Triangle from "../../components/Triangle.vue";

gql`
  query SummaryScreenContainer_GetSummary($id: Int!) {
    summary(id: $id) {
      id
      timing
      percent
      chart {
        id
        level
        name: difficulty
      }
    }
  }
`;

const route = useRoute();

if (!route.query.id) {
  throw Error(`Expected route.query.id to be a string, got ${route.query.id}`);
}

const gqlData = await useQuery({
  query: SummaryScreenContainer_GetSummaryDocument,
  variables: { id: parseInt(route.query.id as string, 10) },
});

const scoreData = computed<TableCell[]>(() => {
  const timingData = JSON.parse(gqlData.data.value?.summary?.timing ?? "{}");

  const timing = windowsWithMiss.map<TableCell>((title) => ({
    title,
    content: timingData[title]?.count ?? "-",
  }));

  return [
    ...timing,
    {
      title: "Holds",
      content: "25/30",
    },
  ];
});
</script>

<template>
  <NonGameplayScreen screenTitle="Evaluation">
    <div class="flex justify-center h-full w-full">
      <div class="wrapper h-full max-1024 flex items-center w-full">
        <div class="vanity flex justify-center flex-col items-center">
          <ScoreBadge
            :percent="gqlData.data.value?.summary?.percent ?? '-'"
            rank="A"
          />
        </div>
        <div class="flex flex-col items-center w-full">
          <div class="lhs-col h-full w-full">
            <SongInfoPanel :data="scoreData" />
            <DifficultyItem
              v-if="gqlData.data.value?.summary?.chart"
              :difficulty="gqlData.data.value?.summary?.chart"
            />
            <PlainPanel class="w-full mods-panel h-full">
              <div class="flex">2x upscroll NOTE HERE</div>
            </PlainPanel>
            <RouterLink
              class="button flex justify-center items-center continue-button"
              to="/"
            >
              Continue
              <span class="triangle">
                <Triangle fill="#373737" />
              </span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </NonGameplayScreen>
</template>

<style>
#app {
  background: none;
}
</style>
<style scoped lang="scss">
@import "../../shared.scss";
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr; // repeat(2, 1fr);
  column-gap: 50px;
}
#screen-summary {
  font-family: "Comfortaa", cursive;
}
.ascii-icon {
  line-height: 0;
  height: 100%;
  padding-bottom: 5px;
  padding-right: 5px;
}
.lhs-col {
  display: grid;
  row-gap: 20px;
  grid-template-rows: max-content 56px 56px;
}
.vanity {
  justify-content: center;
  height: 100%;
}
.button {
  width: 150px;
  font-size: 1.25rem;
  border-radius: 4px;
  border: none;
  background: #d9d9d9;
  padding: 8px;
  &:hover {
    filter: brightness(1.1);
    cursor: pointer;
    animation: none;
  }
}
.continue-button {
  justify-self: flex-end;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% {
    background: #e9e9e9;
  }
  50% {
    background: #a9a9a9;
  }
  100% {
    background: #e9e9e9;
  }
}
.triangle {
  margin: 0 0 0 10px;
}
</style>
