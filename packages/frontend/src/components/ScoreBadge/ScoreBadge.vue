<script lang="ts" setup>
import type { ScoreBadgeProps } from "./types";

const props = defineProps<ScoreBadgeProps>();
</script>

<template>
  <div class="score-badge-outer w-full">
    <div class="score-badge w-full flex flex-col items-center justify-center">
      <div class="rank">{{ props.rank }}</div>
      <div class="percent">{{ props.percent }}%</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../shared.scss";

.score-badge-outer,
.score-badge {
  border-radius: 50%;
  box-sizing: border-box;
  padding: 10px;
}

.score-badge-outer {
  width: $vanity-badge-radius;
  height: $vanity-badge-radius;
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
  font-size: 10rem;
}

.percent {
  font-size: 4rem;
}

.rank,
.percent {
  -webkit-text-stroke: 2px white;
  line-height: normal;
}
</style>
