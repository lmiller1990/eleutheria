<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { Summary } from "@packages/engine";
import { useSummaryStore } from "../../stores/summary";
import { fetchData, getSongId } from "./fetchData";
import Gameplay, { GameplayProps } from "./components/Gameplay";
import "../../style.css";

const router = useRouter();

function songCompleted(summary: Summary) {
  const summaryStore = useSummaryStore();
  summaryStore.setSummary(summary);
  router.push("/summary");
}

const paramData = getSongId();
const songData = await fetchData(paramData.id);

const startGameArgs: GameplayProps["startGameArgs"] = {
  songData,
  paramData,
  songCompleted,
  gameplayModifiers: {
    scroll: "up",
    speed: 1,
  },
};
</script>

<template>
  <div id="game-app">
    <Gameplay :startGameArgs="startGameArgs" />
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
