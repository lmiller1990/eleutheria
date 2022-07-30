<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { GameplayProps } from "../gameplay/components/Gameplay/types";
import { useSongsStore } from "../../stores/songs";
import { injectNoteSkin } from "../../plugins/injectGlobalCssVars";
import EditorPanel from "./EditorPanel";
import type { StartGame } from "../gameplay/gameplay";
import { create } from "../gameplay/gameplay";

const props = defineProps<GameplayProps>();

const root = ref<HTMLDivElement>();

const songsStore = useSongsStore();

if (!songsStore.selectedChart || !songsStore.selectedSong) {
  throw Error(
    `Expected selectedChart and selectedSong to exist in songsStore. This should be impossible.`
  );
}

const defaultNoteSkin = props.startGameArgs.noteSkinData.find(
  (x) => x.name === "default"
);

if (!defaultNoteSkin) {
  throw Error(`No default note skin found`);
}

injectNoteSkin(defaultNoteSkin);

let startAtSeconds = 4;
let repeatIntervalSeconds = 2;
let init: StartGame | undefined;

function createGame() {
  if (!root.value) {
    throw Error("Root node not found!");
  }

  const init = create(
    root.value,
    {
      ...props.startGameArgs,
      songCompleted: () => {},
      updateSummary: () => {},
    },
    false,
    false,
    startAtSeconds * 1000
  );

  if (!init || !init.game) {
    throw Error(`Game was not returned, this should not happen`);
  }

  return init;
}

const start = async () => {
  if (repeatIntervalSeconds === 0) {
    return;
  }

  init = createGame();

  if (!init.game) {
    throw Error(
      "Game should be undefined. Did you incorrect pass __testingDoNotStartSong?"
    );
  }

  init.game.editorRepeat = {
    emitAfterMs: repeatIntervalSeconds * 1000,
    emitAfterMsCallback: () => {
      init?.stop();
      start();
    },
  };

  init.start();
};

onMounted(() => {
  start();
});

function stop() {
  if (!init) {
    throw Error(`Don't stop without starting first!`);
  }
  init.stop();
  init = undefined;
}

function go() {
  if (init) {
    init.stop();
  }
  start();
}

function handleUpdateStartTime(seconds: number) {
  startAtSeconds = seconds;
}

function handleUpdateRepeatInterval(seconds: number) {
  repeatIntervalSeconds = seconds;
}
</script>

<template>
  <div class="editor-content">
    <div class="editor" v-once>
      <div ref="root" class="max-w-l" v-once />
    </div>
    <div>
      <EditorPanel
        :default-repeat-interval="repeatIntervalSeconds"
        :default-start-time="repeatIntervalSeconds"
        @updateStartTime="handleUpdateStartTime"
        @updateRepeatInterval="handleUpdateRepeatInterval"
      />
      <button @click="go">Go</button>
      <button @click="stop">Stop</button>
    </div>
  </div>
</template>

<style>
@import "../../index.css";
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../shared.scss";

.editor-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 50px;
}

.stats-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1.25fr 1fr;
  row-gap: 50px;
}

.info-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  column-gap: 10px;
}
</style>
