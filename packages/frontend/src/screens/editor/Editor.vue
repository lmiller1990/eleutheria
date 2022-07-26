<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { GameplayProps } from "../gameplay/components/Gameplay/types";
import { useSongsStore } from "../../stores/songs";
import { injectNoteSkin } from "../../plugins/injectGlobalCssVars";

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

onMounted(async () => {
  if (!root.value) {
    return;
  }

  const { create } = await import("../gameplay/gameplay");

  const bootstrap = async ($root: HTMLDivElement) => {
    const game = await create(
      $root,
      {
        ...props.startGameArgs,
        updateSummary: () => {},
      },
      props.__testingDoNotStartSong
    );

    if (!game) {
      throw Error(`Game was not returned, this should not happen`);
    }

    return game;
  };

  let init = await bootstrap(root.value);

  init.start();

  window.setInterval(async () => {
    init.stop();
    init = await bootstrap(root.value!);
    init.start();
  }, 2000);
});
</script>

<template>
  <div class="flex justify-center">
    <div class="max-w-l">
      <div class="gameplay-content">
        <div class="gameplay" v-once>
          <div ref="root" class="max-w-l" v-once />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "../../index.css";
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../shared.scss";

.gameplay-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  column-gap: 40px;
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
