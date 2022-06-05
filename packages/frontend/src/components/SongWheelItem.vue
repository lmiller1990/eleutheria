<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const levelIndex = ref(0);

function changeLevel(event: KeyboardEvent) {
  if (event.key === "ArrowLeft") {
    levelIndex.value--;
  }

  if (event.key === "ArrowRight") {
    levelIndex.value++;
  }
}

onMounted(() => {
  window.addEventListener("keydown", changeLevel);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", changeLevel);
});
</script>

<template>
  <div class="blue-4 rounded-border-m wheel-item-wrapper">
    <div class="flex items-center top-section">
      <div class="banner-wrapper padding-8px w-100">
        <img
          src="https://img.freepik.com/free-vector/abstract-yellow-black-wide-banner-design_1017-30890.jpg?w=2000"
          height="100"
          width="500"
        />
      </div>
      <div class="level-circle">5</div>
    </div>

    <div class="upcase flex justify-center blue-5" style="color: white">
      Egotistic Lemontea
    </div>

    <div class="upcase flex justify-center">
      <div class="level-wrapper flex space-between">
        <div
          v-for="(n, idx) in ['easy', 'normal', 'hard', 'expert']"
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

<style>
@import "../index.css";
@import "../../../breeze-css/dist/breeze.css";

.wheel-item-wrapper {
  outline: 5px solid white;
  outline-offset: -10px;
  padding: 10px;
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
</style>
