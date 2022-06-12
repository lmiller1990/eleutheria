<script lang="ts" setup>
const props = defineProps<{
  songTitle: string
  order: number
}>()
</script>

<template>
  <div class="rounded-border-m blue-4 item-wrapper flex items-center justify-center relative">
    <div class="align-center item-title blue-5 w-100">
      <div>{{ order }}:  {{ songTitle }}</div>
    </div>
    <div class="item-level flex items-center justify-center absolute">
      10
    </div>
  </div>
</template>

<style>
:root {
  --radius: 120px;
  --level-size: 30px;
}
</style>

<style scoped lang="scss">
@import "../index.css";
@import "../shared.scss";
@import "../../../breeze-css/dist/breeze.css";

.item-wrapper {
  height: 70px;
  outline: 3px solid white;
  outline-offset: -8px;
  padding: 8px;
  width: 350px;

  @include skew;
}

.item-rect {
  height: 100%;
  width: 100%;
}

.item-title {
  color: white;
  font-size: 1rem;
  @include unskew;
}

.item-level {
  font-size: 1.25rem;
  background: white;
  border-radius: 50%;
  right: 24px;
  height: var(--level-size);
  width: var(--level-size);
  flex: none;
  padding: 8px;
  margin: 0 0 0 5px;
  border: 1px solid;
}
</style>
