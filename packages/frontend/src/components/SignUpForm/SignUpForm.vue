<script lang="ts" setup>
import { reactive } from "vue";
import type { SignUpFormProps } from "./types";
import ValidationInput from "../ValidationInput.vue";
import { min, max, alphanumeric } from "../../validation";

defineProps<SignUpFormProps>();

const username = reactive({
  value: "",
  valid: false,
});

const password = reactive({
  value: "",
  valid: false,
});

// const valid = computed(() => username.valid && password.valid);
</script>

<template>
  <form class="form text-white h-full">
    <ValidationInput
      v-model="username.value"
      :rules="[min(5), max(10), alphanumeric()]"
      label="username"
      @validate="(result) => (username.valid = result.valid)"
    />

    <ValidationInput
      v-model="password.value"
      :rules="[min(5), max(20)]"
      label="password"
      type="password"
      @validate="(result) => (password.valid = result.valid)"
    />
  </form>
</template>

<style scoped lang="scss">
.form {
  background: #373737;
  @apply max-w-3xl max-h-96;
}
</style>
