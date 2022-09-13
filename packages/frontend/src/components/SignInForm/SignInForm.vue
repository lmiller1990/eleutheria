<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { reactive, ref } from "vue";
import Button from "../Button.vue";
import type { SignInFormProps } from "./types";
import ValidationInput from "../ValidationInput.vue";
import { gql } from "@urql/core";
import { useMutation } from "@urql/vue";
import { SignInForm_SignInDocument } from "../../generated/graphql";

gql`
  mutation SignInForm_SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      viewer {
        username
        id
      }
    }
  }
`;

defineProps<SignInFormProps>();

const form = reactive({
  email: {
    value: "a@b.c",
    valid: false,
  },
  password: {
    value: "password",
    valid: false,
  },
});

const valid = computed(
  () => form.email.value.length && form.password.value.length
);
const submitting = ref(false);

const signIn = useMutation(SignInForm_SignInDocument);

function handleSubmit() {
  signIn.executeMutation({
    email: form.email.value,
    password: form.password.value,
  });
}
</script>

<template>
  <form
    class="w-full form text-white h-full flex flex-col items-center p-8"
    @submit.prevent="handleSubmit"
  >
    <ValidationInput
      v-model="form.email.value"
      :rules="[]"
      label="email"
      @validate="(result) => (form.email.valid = result.valid)"
    />

    <ValidationInput
      v-model="form.password.value"
      :rules="[]"
      label="password"
      type="password"
      @validate="(result) => (form.password.valid = result.valid)"
    />

    <Button type="submit" :disabled="!valid || submitting">Submit</Button>
  </form>
</template>

<style scoped lang="scss">
/* Styles */
.form {
  background: #373737;
  @apply max-w-3xl;
}
</style>
