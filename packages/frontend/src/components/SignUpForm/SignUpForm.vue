<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import type { SignUpFormProps } from "./types";
import ValidationInput from "../ValidationInput.vue";
import { min, max, email as emailRule } from "../../validation";
import Button from "../Button.vue";
import { SignUpDocument } from "../../generated/graphql"
import { gql, useMutation } from "@urql/vue";

gql`
  mutation SignUp ($email: String!, $password: String!) {
    signUp(email: $email, password: $password)
  }
`

defineProps<SignUpFormProps>();

const signUp = useMutation(SignUpDocument)

const email = reactive({
  value: "",
  valid: false,
});

const password = reactive({
  value: "",
  valid: false,
});

const valid = computed(() => email.valid && password.valid);

const submitting = ref(false)

async function handleSubmit () {
  if (submitting.value) {
    return
  }

  submitting.value = true

  await signUp.executeMutation({
    email: email.value,
    password: password.value,
  })

  submitting.value = false
}
</script>

<template>
  <form
    class="w-full form text-white h-full flex flex-col items-center p-8"
    @submit.prevent="handleSubmit"
  >
    <ValidationInput
      v-model="email.value"
      :rules="[emailRule()]"
      label="email"
      @validate="(result) => (email.valid = result.valid)"
    />

    <ValidationInput
      v-model="password.value"
      :rules="[min(5), max(20)]"
      label="password"
      type="password"
      @validate="(result) => (password.valid = result.valid)"
    />

    <Button type="submit" :disabled="!valid || submitting">Submit</Button>
  </form>
</template>

<style scoped lang="scss">
.form {
  background: #373737;
  @apply max-w-3xl max-h-96;
}
</style>
