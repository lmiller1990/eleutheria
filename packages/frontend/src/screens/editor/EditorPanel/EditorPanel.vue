<script lang="ts" setup>
import type { EditorPanelProps } from "./types";
import InfoPanel from "../../../components/InfoPanel";
import { FunctionalComponent, h, ref, watch } from "vue";
import Input from "../../../components/Input";

const props = defineProps<EditorPanelProps>();

const emit = defineEmits<{
  (event: "updateStartTime", seconds: number): void;
  (event: "updateRepeatInterval", seconds: number): void;
}>();

function debounce(func: (...args: any[]) => void, timeout = 1000) {
  let timer: number;
  return (...args: any[]) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      func.apply(null, args);
    }, timeout);
  };
}

function secondsToMinSec(seconds: number) {
  const rem = seconds % 60;
  const min = Math.floor(seconds / 60);
  if (rem < 10) {
    return `${min}:${rem.toString().padStart(2, "0")}`;
  }
  return `${min}:${rem.toString()}`;
}

const startTime = ref<string>(secondsToMinSec(props.defaultStartTime));
const repeatIntervalSeconds = ref<string>(
  props.defaultRepeatInterval.toString()
);

watch(
  repeatIntervalSeconds,
  debounce((seconds) => {
    if (isNaN(parseInt(seconds, 10))) {
      return;
    }

    emit("updateRepeatInterval", parseInt(seconds, 10));
  })
);

watch(
  startTime,
  debounce((time) => {
    const split = time.split(":");

    console.log(split);
    if (
      split.length !== 2 ||
      isNaN(parseInt(split[0], 10)) ||
      isNaN(parseInt(split[1], 10))
    ) {
      return;
    }

    emit(
      "updateStartTime",
      parseInt(split[0], 10) * 60 + parseInt(split[1], 10)
    );
  })
);

const Cell: FunctionalComponent = (_props, { slots }) => {
  return h("div", { class: "flex flex-col justify-center" }, slots);
};
</script>

<template>
  <InfoPanel panelTitle="Options">
    <div class="editor-wrapper">
      <Cell>Start Time</Cell>
      <Cell>
        <Input v-model="startTime" />
      </Cell>

      <Cell>Repeat Interval</Cell>
      <Cell>
        <Input v-model="repeatIntervalSeconds" />
      </Cell>
    </div>
  </InfoPanel>
</template>

<style>
@import "../../../index.css";
@import "../../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../../shared.scss";

.editor-wrapper {
  font-family: "Sansation", sans-serif;
  font-weight: bold;

  display: grid;
  grid-template-columns: 1.25fr 1fr;
  grid-template-rows: repeat(4, 60px);
}
</style>
