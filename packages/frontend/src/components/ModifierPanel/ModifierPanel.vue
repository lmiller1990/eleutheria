<script lang="ts" setup>
import { FunctionalComponent, h } from "vue";
import InfoPanel from "../InfoPanel";
import type { ModifierPanelProps } from "./types";

defineProps<ModifierPanelProps>();

const emit = defineEmits<{
  (event: "changeSpeedMod", mod: typeof speedMods[number]): void;
  (event: "changeScrollMod", mod: typeof scrollMods[number]): void;
}>();

const speedMods = ["-100", "-10", "+10", "+100"] as const;
const scrollMods = ["up", "down"] as const;

const ModButton: FunctionalComponent = (_props, { slots }) => {
  return h(
    "button",
    {
      class: "mod-button flex items-center justify-center",
    },
    slots
  );
};
</script>

<template>
  <InfoPanel panelTitle="Modifiers" class="modifier-panel">
    <div class="modifier-wrapper">
      <div>Speed</div>
      <div>{{ currentSpeed }}</div>
      <div>
        <div class="flex">
          <ModButton
            v-for="num of speedMods"
            @click="emit('changeSpeedMod', num)"
          >
            {{ num }}
          </ModButton>
        </div>
      </div>

      <div>Note</div>
      <div>660</div>
      <div class="flex items-center">
        <div v-for="note of notes" :style="note" class="note"></div>
      </div>

      <div>Scroll</div>
      <div>Up</div>
      <div>
        <div class="flex">
          <ModButton
            v-for="mod of scrollMods"
            @click="emit('changeScrollMod', mod)"
          >
            {{ mod }}
          </ModButton>
        </div>
      </div>

      <div>Cover</div>
      <div>??</div>
      <div>Options!</div>
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

.note {
  @include hover-bright;
  margin: 0 10px 0 0;
}

.modifier-panel {
  border: 2px solid white;
  box-shadow: 0px 4px 4px 4px #00000040;
}
</style>
