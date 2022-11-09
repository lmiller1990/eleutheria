<script lang="ts" setup>
import type { InputProps } from "./types";

const props = defineProps<InputProps>();

const emit = defineEmits<{
  (event: "update:modelValue", payload: string): void;
}>();
</script>

<template>
  <input
    :value="props.modelValue"
    @input="event => emit('update:modelValue', (event.target as HTMLInputElement).value)"
  />
</template>

<style scoped lang="scss">
// @import "../../shared.scss";
</style>
