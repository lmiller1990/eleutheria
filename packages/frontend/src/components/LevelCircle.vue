<script lang="ts" setup>
import type { CSSProperties } from "vue";

const props = withDefaults(
  defineProps<{
    height: number;
    level: number;
    maxLevel: number;
  }>(),
  {
    height: 50,
  }
);

const strokeWidth = 4;
const innerRad = (props.height - 10) / 2 - 5;
const radius = innerRad + 2;
const difficulty = props.level / props.maxLevel;

const rotateAbout = radius + strokeWidth / 2;
const transform = `rotate(-90, ${rotateAbout}, ${rotateAbout})`;

const circumference = radius * 2 * Math.PI;
const offset = circumference - circumference * difficulty;

const circle1Style: CSSProperties = {
  height: `${props.height}px`,
  width: `${props.height}px`,
};

const circle2Style: CSSProperties = {
  height: `${props.height - 10}px`,
  width: `${props.height - 10}px`,
};
</script>

<template>
  <div class="circle circle-wrapper circle-1" :style="circle1Style">
    <div
      class="circle circle-2 flex items-center justify-center"
      :style="circle2Style"
    >
      <svg class="h-100 w-100">
        <circle
          :stroke-width="strokeWidth"
          :transform="transform"
          stroke="blue"
          cx="50%"
          cy="50%"
          fill="transparent"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="offset"
          :r="radius"
        />
        <circle
          stroke="skyblue"
          cx="50%"
          cy="50%"
          fill="skyblue"
          :r="innerRad"
        />
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="white"
        >
          {{ level }}
        </text>
      </svg>
    </div>
  </div>
</template>

<style>
:root {
  --border-black: 1px solid black;
}
</style>

<style scoped>
@import "../index.css";
@import "../../../breeze-css/dist/breeze.css";

.circle-wrapper {
  flex: none;
}

.circle {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-1 {
  border: var(--border-black);
  /* https://kovart.github.io/dashed-border-generator/ */
  background: white;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='skyblue' stroke-width='10' stroke-dasharray='1,24' stroke-linecap='square'/%3e%3c/svg%3e");
}

.circle-2 {
  background: lightgray;
  border: var(--border-black);
}

text {
  font-size: 1.5rem;
}
</style>
