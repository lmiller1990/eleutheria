<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import type { SignUpFormProps } from "./types";
import ValidationInput from "../ValidationInput.vue";
import { min, max, email as emailRule } from "../../validation";
import Button from "../Button.vue";
import { SignUpDocument } from "../../generated/graphql";
import { gql, useMutation } from "@urql/vue";

gql`
  mutation SignUp($email: String!, $password: String!, $username: String!) {
    signUp(email: $email, password: $password, username: $username)
  }
`;

defineProps<SignUpFormProps>();

const signUp = useMutation(SignUpDocument);

const form = reactive({
  email: {
    value: "a@b.com",
    valid: false,
  },
  password: {
    value: "password",
    valid: false,
  },
  username: {
    value: "lachlan",
    valid: false,
  },
});

const valid = computed(
  () => form.email.valid && form.password.valid && form.username.valid
);

const submitting = ref(false);

onMounted(() => {
  // getViewer.executeQuery()
});

async function handleSubmit() {
  if (submitting.value && valid.value) {
    return;
  }

  submitting.value = true;

  await signUp.executeMutation({
    email: form.email.value,
    password: form.password.value,
    username: form.username.value,
  });

  submitting.value = false;
}
</script>

<template>
  <form
    class="w-full form text-white h-full flex flex-col items-center p-8"
    @submit.prevent="handleSubmit"
  >
    <ValidationInput
      v-model="form.username.value"
      :rules="[min(5), max(20)]"
      label="username"
      @validate="(result) => (form.username.valid = result.valid)"
    />

    <ValidationInput
      v-model="form.email.value"
      :rules="[emailRule()]"
      label="email"
      @validate="(result) => (form.email.valid = result.valid)"
    />

    <ValidationInput
      v-model="form.password.value"
      :rules="[min(5), max(20)]"
      label="password"
      type="password"
      @validate="(result) => (form.password.valid = result.valid)"
    />

    <Button type="submit" :disabled="!valid || submitting">Submit</Button>
  </form>
</template>

<style scoped lang="scss">
.form {
  background: #373737;
  @apply max-w-3xl;
}
</style>
