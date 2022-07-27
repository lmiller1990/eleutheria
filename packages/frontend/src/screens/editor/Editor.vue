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

let interval: number;
let init: StartGame;

let startAtSeconds = 0;
let repeatIntervalSeconds = 0;
let loading = false;

const bootstrap = async ($root: HTMLDivElement) => {
  const game = await create(
    $root,
    {
      ...props.startGameArgs,
      songCompleted: () => {},
      updateSummary: () => {},
    },
    props.__testingDoNotStartSong,
    false,
    startAtSeconds * 1000
  );

  if (!game) {
    throw Error(`Game was not returned, this should not happen`);
  }

  return game;
};

async function run() {
  if (loading) {
    return;
  }

  loading = true;

  console.log(`Executing`);
  window.clearInterval(interval);

  if (!root.value) {
    return;
  }

  if (init) {
    init.stop();
  }

  init = await bootstrap(root.value);

  await init.start();

  loading = false;

  if (repeatIntervalSeconds === 0) {
    return;
  }

  // interval = window.setInterval(async () => {
  //   console.log("Interval Ms: ", repeatIntervalSeconds * 1000);
  //   init.stop();
  //   init = await bootstrap(root.value!);
  //   init.start();
  // }, repeatIntervalSeconds * 1000);
}

onMounted(() => {
  run();
});

function go() {
  run();
}

function handleUpdateStartTime(seconds: number) {
  startAtSeconds = seconds;
  run();
}

function handleUpdateRepeatInterval(seconds: number) {
  repeatIntervalSeconds = seconds;
  run();
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

// .modifier-wrapper {
//   margin: 0 30px;
// }
</style>
