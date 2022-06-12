<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import LevelCircle from "./LevelCircle.vue";
import DifficultyLabel from "./DifficultyLabel.vue";

const props = defineProps<{
  songTitle: string
}>()

const levelIndex = ref(0);

function changeLevel(event: KeyboardEvent) {
  if (event.key === "ArrowLeft") {
    levelIndex.value--;
  }

  if (event.key === "ArrowRight") {
    levelIndex.value++;
  }
}

const difficulties = ['easy', 'normal', 'hard', 'expert']

const difficulty = computed(() => difficulties[levelIndex.value])

onMounted(() => {
  window.addEventListener("keydown", changeLevel);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", changeLevel);
});
</script>

<template>
  <div class="blue-4 rounded-border-m wheel-item-wrapper">
    <div class="flex items-center top-section space-around">
      <div class="banner-wrapper padding-8px">
        <img
          src="https://img.freepik.com/free-vector/abstract-yellow-black-wide-banner-design_1017-30890.jpg?w=2000"
          height="80"
          width="300"
        />
      </div>

      <div class="flex flex-col items-center level-rating">
        <DifficultyLabel>{{ difficulty }}</DifficultyLabel>
        <LevelCircle :level="10" :max-level="40" :height="60" />
      </div>
    </div>

    <div class="upcase flex justify-center blue-5 song-title-wrapper" style="color: white">
      <div class="song-title">
        {{ props.songTitle }}
      </div>
    </div>

    <div class="upcase flex justify-center">
      <div class="level-wrapper flex space-between">
        <div
          v-for="(n, idx) in difficulties"
          :key="n"
          :class="[
            n,
            {
              [`${n}-highlight`]: idx === levelIndex,
              highlight: idx === levelIndex,
            },
          ]"
          class="level-label flex justify-center items-center"
        >
          {{ n.slice(0, 1) }}: {{ (idx + 1) * 10 }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../index.css";
@import "../../../breeze-css/dist/breeze.css";
@import "../shared.scss";

.wheel-item-wrapper {
  outline: 5px solid white;
  outline-offset: -10px;
  padding: 10px;
  width: 550px;

  @include skew;
}

.top-section {
  padding: 8px;
}

.banner-wrapper {
  background: black;
  margin: 0 4px 0 0;
}

.level-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: skyblue;
  flex: none;
}

:root {
  --label: 60px;
}

.level-label {
  border-radius: 16px;
  border: 2px solid;
  width: var(--label);
  height: 20px;
}

.level-wrapper {
  width: calc(30px + var(--label) * 4);
  margin: 5px 0;
}

.highlight {
  border-color: #c3cc6d;
}

.easy {
  background: #6e92be;
}

.easy-highlight {
  background: #8fbef6;
}

.normal {
  background: #43995a;
}

.normal-highlight {
  background: #5dd57d;
}

.hard {
  background: #81925b;
}

.hard-highlight {
  background: #c1dc88;
}

.expert {
  background: #957588;
}

.expert-highlight {
  background: #daaac7;
}

.level-rating {
  width: 80px;
}

.song-title-wrapper {
  font-size: 1.2rem;

  @include unskew;
}
</style>
