<script lang="ts" setup>
import type { ScoreBadgeProps } from "./types";

const props = defineProps<ScoreBadgeProps>();
</script>

<template>
  <div class="score-badge-outer w-100">
    <div class="score-badge w-100 flex flex-col items-center justify-center">
      <div class="rank">{{ props.rank }}</div>
      <div class="percent">{{ props.percent }}%</div>
    </div>
  </div>
</template>

<style>
@import "../../index.css";
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../shared.scss";

$radius: 300px;

.score-badge-outer,
.score-badge {
  border-radius: 50%;
  box-sizing: border-box;
  padding: 10px;
}

.score-badge-outer {
  width: $radius;
  height: $radius;
  box-sizing: content-box;

  color: #373737;
  background: linear-gradient(
    180deg,
    #ff0000 0%,
    #faff00 35.42%,
    #00bb4b 65.62%,
    #0500ff 100%
  );
}

.score-badge {
  display: flex;
  align-items: center;
  height: 100%;
  background: #d9d9d9;
  font-family: "Sansation" !important;
  font-style: normal;
  font-weight: 700;
}

.rank {
  font-size: 7rem;
}

.percent {
  font-size: 3.5rem;
}

.rank,
.percent {
  -webkit-text-stroke: 2px white;
  line-height: normal;
}
</style>
