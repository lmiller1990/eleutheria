<script lang="ts" setup>
import { computed, reactive } from "vue";
import type { SignUpFormProps } from "./types";
import ValidationInput from "../ValidationInput.vue";
import { min, max, alphanumeric } from "../../validation";
import Button from "../Button.vue";
import { } from "../../generated/graphql"
import { gql } from "@urql/vue";

gql`
  mutation SignUp ($email: String!, $password: String!) {
    signUp(email: $email, password: $password)
  }
`

defineProps<SignUpFormProps>();

// const signUp = useMutation(SignUp)

const username = reactive({
  value: "",
  valid: false,
});

const password = reactive({
  value: "",
  valid: false,
});

const valid = computed(() => username.valid && password.valid);

function handleSubmit () {

}
</script>

<template>
  <form
    class="form text-white h-full flex flex-col items-center p-8"
    @submit.prevent="handleSubmit"
  >
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

    <Button type="submit" :disabled="!valid">Submit</Button>
  </form>
</template>

<style scoped lang="scss">
.form {
  background: #373737;
  @apply max-w-3xl max-h-96;
}
</style>
