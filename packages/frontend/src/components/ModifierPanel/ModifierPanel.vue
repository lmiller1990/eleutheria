<script lang="ts" setup>
import type { NoteSkin } from "@packages/types";
import { computed, FunctionalComponent, h } from "vue";
import InfoPanel from "../InfoPanel";
import type { ModifierPanelProps, ModCoverParams } from "./types";
import { getStyleByClass } from "./css";

const props = defineProps<ModifierPanelProps>();

const emit = defineEmits<{
  (event: "changeSpeedMod", mod: number): void;
  (event: "changeScrollMod", mod: typeof scrollMods[number]): void;
  (event: "changeNoteSkin", noteSkin: NoteSkin): void;
  (event: "changeCover", params: ModCoverParams): void;
}>();

const speedMods = ["-0.125", "-0.25", "+0.25", "+0.125"] as const;
const scrollMods = ["up", "down"] as const;
const coverMods: Array<ModCoverParams> = [
  { id: "default", style: "background: gray;", visible: true },
  { id: "pink", style: "background: pink;", visible: true },
  { id: "lightblue", style: "background: lightblue;", visible: true },
  { id: "violet", style: "background: violet;", visible: true },
  { id: "none", style: "background: transparent;", visible: false },
];

function extractCss(style: string) {
  return getStyleByClass(style, ".note");
}

const ModButton: FunctionalComponent = (_props, { slots }) => {
  return h(
    "button",
    {
      class: "mod-button flex items-center justify-center",
    },
    slots
  );
};

const Cell: FunctionalComponent = (_props, { slots }) => {
  return h("div", { class: "flex flex-col justify-center" }, slots);
};

const NORMALIZER = 400;

const normalizedSpeed = computed(() => {
  return props.currentSpeed * NORMALIZER;
});

function handleChangeSpeedMod(val: typeof speedMods[number]) {
  emit("changeSpeedMod", parseFloat(val));
}

function normalizeMod(val: typeof speedMods[number]) {
  const n = parseFloat(val);
  return `${Math.sign(n) > 0 ? "+" : "-"}${Math.abs(n * NORMALIZER)}`;
}
</script>

<template>
  <InfoPanel panelTitle="Modifiers" class="modifier-panel">
    <div class="modifier-wrapper">
      <Cell>Speed</Cell>
      <Cell>{{ normalizedSpeed }}</Cell>
      <Cell>
        <div class="flex">
          <ModButton
            v-for="num of speedMods"
            @click="handleChangeSpeedMod(num)"
          >
            {{ normalizeMod(num) }}
          </ModButton>
        </div>
      </Cell>

      <Cell>Note</Cell>
      <Cell>??</Cell>
      <div class="flex items-center">
        <div
          v-for="note of notes"
          :style="extractCss(note.css)"
          class="note-mod"
          :id="`note-${note.name}`"
          @click="emit('changeNoteSkin', note)"
        />
      </div>

      <Cell>Scroll</Cell>
      <Cell>{{ currentScroll }}</Cell>
      <Cell>
        <div class="flex">
          <ModButton
            v-for="mod of scrollMods"
            @click="emit('changeScrollMod', mod)"
          >
            {{ mod }}
          </ModButton>
        </div>
      </Cell>

      <Cell>Cover</Cell>
      <Cell>??</Cell>
      <Cell>
        <div class="flex">
          <ModButton v-for="mod of coverMods" @click="emit('changeCover', mod)">
            {{ mod.id }}
          </ModButton>
        </div>
      </Cell>
    </div>
  </InfoPanel>
</template>

<style>
@import "../../index.css";
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../shared.scss";

.modifier-wrapper {
  font-family: "Sansation", sans-serif;
  font-weight: bold;

  display: grid;
  grid-template-columns: 1fr 1fr 2.5fr;
  grid-template-rows: repeat(4, 60px);
}

@mixin hover-bright {
  &:hover {
    filter: brightness(1.2);
    cursor: pointer;
  }
}

.mod-button {
  @include hover-bright;
  border: 1px solid #d9d9d9;
  color: #d9d9d9;
  border-radius: 5px;
  background: none;
  margin: 0 5px;
  height: 30px;
  padding: 5px 10px 3px 10px;
  text-transform: capitalize;
}

.note-mod {
  @include hover-bright;
  width: calc(var(--col-width) * 0.95);
  height: var(--note-height);
  margin: 0 10px 0 0;
}

.modifier-panel {
  border: 2px solid white;
  box-shadow: 0px 4px 4px 4px #00000040;
}
</style>
