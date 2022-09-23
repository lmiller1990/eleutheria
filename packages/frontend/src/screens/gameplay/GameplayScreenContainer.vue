<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { World } from "@packages/engine";
import { extractNotesFromWorld } from "@packages/engine/utils";
import { getParams, fetchNoteSkins, fetchUser } from "./fetchData";
import Gameplay from "./components/Gameplay";
import "../../style.css";
import { useQuery, gql, useMutation } from "@urql/vue";
import {
  GameplayScreenDocument,
  GameplayScreen_SummaryDocument,
} from "../../../src/generated/graphql";
import { computed } from "vue";
import { StartGameArgs } from "./gameplay";

const router = useRouter();

gql`
  query GameplayScreen($songId: Int!, $difficulty: String!) {
    ...Gameplay
    song(songId: $songId) {
      chart(difficulty: $difficulty) {
        id
      }
    }
  }
`;

gql`
  mutation GameplayScreen_Summary(
    $tapNotes: [SummaryNote!]!
    $holdNotes: [[SummaryNote!]!]!
    $chartId: Int!
  ) {
    saveScore(
      data: { tapNotes: $tapNotes, holdNotes: $holdNotes, chartId: $chartId }
    ) {
      id
    }
  }
`;

const [noteSkinData, userData] = await Promise.all([
  fetchNoteSkins(),
  fetchUser(),
]);

const { songId, difficulty } = getParams();
const query = await useQuery({
  query: GameplayScreenDocument,
  variables: {
    songId: parseInt(songId, 10),
    difficulty,
  },
});

const gqlData = computed(() => {
  if (!query.data.value?.song?.chart.parsedTapNoteChart) {
    throw Error("uh oh!");
  }
  return query.data.value;
});

const saveScore = useMutation(GameplayScreen_SummaryDocument);

async function songCompleted(world: World) {
  const summaryData = extractNotesFromWorld(world);

  const res = await saveScore.executeMutation({
    ...summaryData,
    chartId: gqlData.value.song.chart.id,
  });

  if (!res.data?.saveScore?.id) {
    throw Error(`Expected id to be returned for score`);
  }

  router.push({ path: "/summary", query: { id: res.data.saveScore.id } });
}

const startGameArgs: Omit<StartGameArgs, "updateSummary"> = {
  songData: {
    chart: {
      parsedTapNoteChart: {
        tapNotes: gqlData.value.song.chart.parsedTapNoteChart.slice(),
      },
      offset: gqlData.value.song.chart.offset,
    },
  },
  paramData: { songId, difficulty },
  noteSkinData,
  userData,
  songCompleted,
};
</script>

<template>
  <div id="game-app">
    <Gameplay :startGameArgs="startGameArgs" :gql="gqlData" />
  </div>
</template>

<style scoped>
.side {
  margin: 40px;
}

.empty {
  visibility: hidden;
}

.capitalize {
  text-transform: capitalize;
}
</style>
